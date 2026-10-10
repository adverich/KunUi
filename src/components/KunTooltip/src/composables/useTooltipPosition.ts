import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'

const MARGIN = 8

export type TooltipLocation = 'top' | 'bottom' | 'left' | 'right';
export interface TooltipOffset { x: number; y: number }
export type TooltipDist = number | Partial<TooltipOffset>;

function getScrollableAncestors(element: Element | null | undefined): Element[] {
  const ancestors: Element[] = []
  let current = element?.parentElement as Element | null | undefined

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

function resolveOffset(dist: TooltipDist | undefined): TooltipOffset {
  if (typeof dist === 'number') return { x: 0, y: dist }
  return { x: dist?.x ?? 0, y: dist?.y ?? 0 }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function resolveLocation(
  preferred: TooltipLocation,
  flip: boolean | undefined,
  activatorRect: DOMRect,
  tooltipRect: DOMRect,
  offset: TooltipOffset,
): TooltipLocation {
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

function computeCoords(
  location: TooltipLocation,
  activatorRect: DOMRect,
  tooltipRect: DOMRect,
  offset: TooltipOffset,
): { top: number; left: number } {
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

export interface TooltipPositionOptions {
    location: TooltipLocation;
    flip?: boolean;
    dist?: TooltipDist;
}

interface ScrollHandler {
    target: Window | Element;
    event: string;
    handler: EventListener;
    options: AddEventListenerOptions;
}

export function useTooltipPosition(
  activatorRef: Ref<HTMLElement | null>,
  tooltipRef: Ref<HTMLElement | null>,
  isVisibleRef: Ref<boolean>,
  getOptions: () => TooltipPositionOptions,
) {
  const tooltipStyle: Ref<Record<string, string>> = ref({})
  let scrollHandlers: ScrollHandler[] = []
  let rafId: number | null = null

  function updatePosition(): void {
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

  function onScrollOrResize(): void {
    if (!isVisibleRef.value) return
    if (rafId) return
    rafId = requestAnimationFrame(() => {
      rafId = null
      updatePosition()
    })
  }

  function startScrollTracking(): void {
    stopScrollTracking()

    const el = activatorRef.value
    if (!el) return

    const winOptions: AddEventListenerOptions = { capture: true, passive: true }
    window.addEventListener('scroll', onScrollOrResize, winOptions)
    scrollHandlers.push({ target: window, event: 'scroll', handler: onScrollOrResize as EventListener, options: winOptions })

    window.addEventListener('resize', onScrollOrResize, winOptions)
    scrollHandlers.push({ target: window, event: 'resize', handler: onScrollOrResize as EventListener, options: winOptions })

    getScrollableAncestors(el).forEach((ancestor: Element) => {
      const opts: AddEventListenerOptions = { passive: true }
      ancestor.addEventListener('scroll', onScrollOrResize, opts)
      scrollHandlers.push({ target: ancestor, event: 'scroll', handler: onScrollOrResize as EventListener, options: opts })
    })
  }

  function stopScrollTracking(): void {
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = null
    }

    scrollHandlers.forEach(({ target, event, handler, options }: ScrollHandler) => {
      target.removeEventListener(event, handler, options)
    })
    scrollHandlers = []
  }

  onMounted(() => startScrollTracking())
  onBeforeUnmount(() => stopScrollTracking())

  return { tooltipStyle, updatePosition, startScrollTracking }
}
