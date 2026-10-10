/**
 * Auto-scroll helpers for HTML5 drag-and-drop.
 * Native DnD does not scroll overflow containers or honor the mouse wheel;
 * edge proximity + rAF is the standard workaround.
 */

function canScroll(el: Element | null | undefined): boolean {
  if (!el || el.nodeType !== 1) return false
  const target = el as HTMLElement;
  const style = window.getComputedStyle(target)
  const overflowY = style.overflowY
  const overflowX = style.overflowX
  const yScrollable =
    (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') &&
    target.scrollHeight > target.clientHeight + 1
  const xScrollable =
    (overflowX === 'auto' || overflowX === 'scroll' || overflowX === 'overlay') &&
    target.scrollWidth > target.clientWidth + 1
  return yScrollable || xScrollable
}

/**
 * Walk up from `el` and return the nearest overflow scroll parent.
 * Falls back to `document.scrollingElement` / `document.documentElement`.
 */
export function findScrollParent(el: Element | null | undefined): Element | null {
  let node = (el?.nodeType === 1 ? el : el?.parentElement) as Element | null | undefined
  while (node && node !== document.body && node !== document.documentElement) {
    if (canScroll(node)) return node
    node = node.parentElement
  }
  const root = document.scrollingElement || document.documentElement
  return root || null
}

export interface AutoScrollOptions { sensitivity?: number; speed?: number }

/**
 * Scroll deltas when the pointer is within `sensitivity` px of an edge.
 * Positive dy = scroll down; positive dx = scroll right.
 */
export function getAutoScrollDelta(
  clientX: number,
  clientY: number,
  scrollEl: Element | null | undefined,
  opts: AutoScrollOptions = {},
): { dx: number; dy: number } {
  const sensitivity = Math.max(0, Number(opts.sensitivity ?? 50))
  const speed = Math.max(0, Number(opts.speed ?? 12))
  if (!scrollEl || speed === 0 || sensitivity === 0) {
    return { dx: 0, dy: 0 }
  }

  const target = scrollEl as HTMLElement;
  const rect = target.getBoundingClientRect()
  let dx = 0
  let dy = 0

  const maxScrollTop = target.scrollHeight - target.clientHeight
  const maxScrollLeft = target.scrollWidth - target.clientWidth

  if (maxScrollTop > 0) {
    if (clientY < rect.top + sensitivity) {
      const intensity = 1 - Math.max(0, clientY - rect.top) / sensitivity
      dy = -Math.ceil(speed * intensity)
    } else if (clientY > rect.bottom - sensitivity) {
      const intensity = 1 - Math.max(0, rect.bottom - clientY) / sensitivity
      dy = Math.ceil(speed * intensity)
    }
  }

  if (maxScrollLeft > 0) {
    if (clientX < rect.left + sensitivity) {
      const intensity = 1 - Math.max(0, clientX - rect.left) / sensitivity
      dx = -Math.ceil(speed * intensity)
    } else if (clientX > rect.right - sensitivity) {
      const intensity = 1 - Math.max(0, rect.right - clientX) / sensitivity
      dx = Math.ceil(speed * intensity)
    }
  }

  return { dx, dy }
}
