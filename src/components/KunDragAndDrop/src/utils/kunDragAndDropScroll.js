/**
 * Auto-scroll helpers for HTML5 drag-and-drop.
 * Native DnD does not scroll overflow containers or honor the mouse wheel;
 * edge proximity + rAF is the standard workaround.
 */

/**
 * @param {Element|null|undefined} el
 * @returns {boolean}
 */
function canScroll(el) {
  if (!el || el.nodeType !== 1) return false
  const style = window.getComputedStyle(el)
  const overflowY = style.overflowY
  const overflowX = style.overflowX
  const yScrollable =
    (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') &&
    el.scrollHeight > el.clientHeight + 1
  const xScrollable =
    (overflowX === 'auto' || overflowX === 'scroll' || overflowX === 'overlay') &&
    el.scrollWidth > el.clientWidth + 1
  return yScrollable || xScrollable
}

/**
 * Walk up from `el` and return the nearest overflow scroll parent.
 * Falls back to `document.scrollingElement` / `document.documentElement`.
 * @param {Element|null|undefined} el
 * @returns {Element|null}
 */
export function findScrollParent(el) {
  let node = el?.nodeType === 1 ? el : el?.parentElement
  while (node && node !== document.body && node !== document.documentElement) {
    if (canScroll(node)) return node
    node = node.parentElement
  }
  const root = document.scrollingElement || document.documentElement
  return root || null
}

/**
 * Scroll deltas when the pointer is within `sensitivity` px of an edge.
 * Positive dy = scroll down; positive dx = scroll right.
 *
 * @param {number} clientX
 * @param {number} clientY
 * @param {Element|null|undefined} scrollEl
 * @param {{ sensitivity?: number, speed?: number }} [opts]
 * @returns {{ dx: number, dy: number }}
 */
export function getAutoScrollDelta(
  clientX,
  clientY,
  scrollEl,
  opts = {}
) {
  const sensitivity = Math.max(0, Number(opts.sensitivity ?? 50))
  const speed = Math.max(0, Number(opts.speed ?? 12))
  if (!scrollEl || speed === 0 || sensitivity === 0) {
    return { dx: 0, dy: 0 }
  }

  const rect = scrollEl.getBoundingClientRect()
  let dx = 0
  let dy = 0

  const maxScrollTop = scrollEl.scrollHeight - scrollEl.clientHeight
  const maxScrollLeft = scrollEl.scrollWidth - scrollEl.clientWidth

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
