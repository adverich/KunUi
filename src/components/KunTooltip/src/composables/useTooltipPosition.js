import { ref, onMounted, onBeforeUnmount } from 'vue'

const MARGIN = 8

function getScrollableAncestors(element) {
  const ancestors = []
  let current = element?.parentElement

  while (current) {
    const { overflowY, overflowX, overflow } = window.getComputedStyle(current)
    if (['auto', 'scroll', 'overlay'].includes(overflowY) ||
        ['auto', 'scroll', 'overlay'].includes(overflowX) ||
        ['auto', 'scroll', 'overlay'].includes(overflow)) {
      ancestors.push(current)
    }
    current = current.parentElement
  }

  return ancestors
}

function resolveOffset(dist) {
  if (typeof dist === 'number') return { x: 0, y: dist }
  return { x: dist?.x ?? 0, y: dist?.y ?? 0 }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function resolveLocation(preferred, flip, activatorRect, tooltipRect, offset) {
  const { x, y } = offset
  const vw = window.innerWidth
  const vh = window.innerHeight

  if (!flip) return preferred

  if (preferred === 'top') {
    const spaceAbove = activatorRect.top - y - MARGIN
    const spaceBelow = vh - activatorRect.bottom - y - MARGIN
    if (spaceAbove < tooltipRect.height && spaceBelow > spaceAbove) return 'bottom'
  } else if (preferred === 'bottom') {
    const spaceBelow = vh - activatorRect.bottom - y - MARGIN
    const spaceAbove = activatorRect.top - y - MARGIN
    if (spaceBelow < tooltipRect.height && spaceAbove > spaceBelow) return 'top'
  } else if (preferred === 'left') {
    const spaceLeft = activatorRect.left - x - MARGIN
    const spaceRight = vw - activatorRect.right - x - MARGIN
    if (spaceLeft < tooltipRect.width && spaceRight > spaceLeft) return 'right'
  } else if (preferred === 'right') {
    const spaceRight = vw - activatorRect.right - x - MARGIN
    const spaceLeft = activatorRect.left - x - MARGIN
    if (spaceRight < tooltipRect.width && spaceLeft > spaceRight) return 'left'
  }

  return preferred
}

function computeCoords(location, activatorRect, tooltipRect, offset) {
  const { x, y } = offset

  switch (location) {
    case 'bottom':
      return {
        top: activatorRect.bottom + y,
        left: activatorRect.left + activatorRect.width / 2 - tooltipRect.width / 2 + x,
      }
    case 'left':
      return {
        top: activatorRect.top + activatorRect.height / 2 - tooltipRect.height / 2 + y,
        left: activatorRect.left - tooltipRect.width - x,
      }
    case 'right':
      return {
        top: activatorRect.top + activatorRect.height / 2 - tooltipRect.height / 2 + y,
        left: activatorRect.right + x,
      }
    case 'top':
    default:
      return {
        top: activatorRect.top - tooltipRect.height - y,
        left: activatorRect.left + activatorRect.width / 2 - tooltipRect.width / 2 + x,
      }
  }
}

export function useTooltipPosition(activatorRef, tooltipRef, isVisibleRef, getOptions) {
  const tooltipStyle = ref({})
  let scrollHandlers = []
  let rafId = null

  function updatePosition() {
    const activator = activatorRef.value
    const tooltip = tooltipRef.value
    if (!activator || !tooltip) return

    const activatorRect = activator.getBoundingClientRect()
    const tooltipRect = tooltip.getBoundingClientRect()
    const { location, flip, dist } = getOptions()
    const offset = resolveOffset(dist)
    const vw = window.innerWidth
    const vh = window.innerHeight

    const resolvedLocation = resolveLocation(location, flip, activatorRect, tooltipRect, offset)
    let { top, left } = computeCoords(resolvedLocation, activatorRect, tooltipRect, offset)

    const maxLeft = Math.max(MARGIN, vw - tooltipRect.width - MARGIN)
    const maxTop = Math.max(MARGIN, vh - tooltipRect.height - MARGIN)
    left = clamp(left, MARGIN, maxLeft)
    top = clamp(top, MARGIN, maxTop)

    tooltipStyle.value = {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      maxWidth: `${vw - MARGIN * 2}px`,
    }
  }

  function onScrollOrResize() {
    if (!isVisibleRef.value) return
    if (rafId) return
    rafId = requestAnimationFrame(() => {
      rafId = null
      updatePosition()
    })
  }

  function startScrollTracking() {
    stopScrollTracking()

    const el = activatorRef.value
    if (!el) return

    const winOptions = { capture: true, passive: true }
    window.addEventListener('scroll', onScrollOrResize, winOptions)
    scrollHandlers.push({ target: window, event: 'scroll', handler: onScrollOrResize, options: winOptions })

    window.addEventListener('resize', onScrollOrResize, winOptions)
    scrollHandlers.push({ target: window, event: 'resize', handler: onScrollOrResize, options: winOptions })

    getScrollableAncestors(el).forEach((ancestor) => {
      const opts = { passive: true }
      ancestor.addEventListener('scroll', onScrollOrResize, opts)
      scrollHandlers.push({ target: ancestor, event: 'scroll', handler: onScrollOrResize, options: opts })
    })
  }

  function stopScrollTracking() {
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = null
    }

    scrollHandlers.forEach(({ target, event, handler, options }) => {
      target.removeEventListener(event, handler, options)
    })
    scrollHandlers = []
  }

  onMounted(() => startScrollTracking())
  onBeforeUnmount(() => stopScrollTracking())

  return { tooltipStyle, updatePosition, startScrollTracking }
}
