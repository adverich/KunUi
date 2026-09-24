/**
 * Resolve a stable key for a list item.
 * @param {*} item
 * @param {string|Function} itemKey
 * @param {number} index
 */
export function resolveItemKey(item, itemKey = 'id', index = 0) {
  if (typeof itemKey === 'function') return itemKey(item, index)
  if (item != null && typeof item === 'object' && itemKey != null) {
    const key = item[itemKey]
    if (key != null) return key
  }
  return item
}

/**
 * FormKit performSort: remove dragged value(s), splice at targetIndex.
 * @template T
 * @param {T[]} items
 * @param {number} fromIndex
 * @param {number} targetIndex - index of the hovered node (pre-filter)
 * @returns {T[]}
 */
export function performSort(items, fromIndex, targetIndex) {
  if (!Array.isArray(items) || fromIndex < 0 || fromIndex >= items.length) {
    return items ? [...items] : []
  }
  if (targetIndex < 0 || targetIndex >= items.length) {
    return [...items]
  }
  if (fromIndex === targetIndex) {
    return [...items]
  }

  const dragged = items[fromIndex]
  const next = items.filter((_, i) => i !== fromIndex)
  // FormKit: splice at the original target index into the filtered array
  const at = Math.max(0, Math.min(targetIndex, next.length))
  next.splice(at, 0, dragged)
  return next
}

/**
 * @template T
 * @param {T[]} sourceItems
 * @param {number} fromIndex
 * @param {T[]} targetItems
 * @param {number} targetIndex
 * @returns {{ source: T[], target: T[], item: T|undefined }}
 */
export function performTransfer(sourceItems, fromIndex, targetItems, targetIndex) {
  const source = [...(sourceItems || [])]
  const target = [...(targetItems || [])]
  if (fromIndex < 0 || fromIndex >= source.length) {
    return { source, target, item: undefined }
  }
  const [item] = source.splice(fromIndex, 1)
  const at = Math.max(0, Math.min(targetIndex, target.length))
  target.splice(at, 0, item)
  return { source, target, item }
}

/**
 * Relative position of dragged rect vs target rect (FormKit incomingDirection).
 * @returns {'above'|'below'|'left'|'right'}
 */
export function getIncomingDirection(dragRect, targetRect) {
  const yDiff = targetRect.y - dragRect.y
  const xDiff = targetRect.x - dragRect.x
  if (Math.abs(yDiff) > Math.abs(xDiff)) {
    return yDiff > 0 ? 'above' : 'below'
  }
  return xDiff > 0 ? 'left' : 'right'
}

/**
 * FormKit validateSort threshold gate.
 * @param {'above'|'below'|'left'|'right'} incomingDirection
 * @param {DOMRect} targetRect
 * @param {number} x
 * @param {number} y
 * @param {{ horizontal?: number, vertical?: number }} threshold
 */
export function passesSortThreshold(incomingDirection, targetRect, x, y, threshold = {}) {
  const h = threshold.horizontal ?? 0
  const v = threshold.vertical ?? 0

  switch (incomingDirection) {
    case 'left':
      return x > targetRect.x + targetRect.width * h
    case 'right':
      return x < targetRect.x + targetRect.width * (1 - h)
    case 'above':
      return y > targetRect.y + targetRect.height * v
    case 'below':
      return y < targetRect.y + targetRect.height * (1 - v)
    default:
      return false
  }
}

/**
 * Find which item element is under the pointer (excluding the dragged one).
 * Strict hit-test only — no "closest center" fallback (that caused imprecise grid jumps).
 * @param {HTMLElement} parentEl
 * @param {number} clientX
 * @param {number} clientY
 * @param {HTMLElement|null} excludeEl
 * @returns {HTMLElement|null}
 */
export function getTargetItemFromPoint(parentEl, clientX, clientY, excludeEl = null) {
  if (!parentEl) return null

  const children = [...parentEl.children].filter(
    (el) =>
      el !== excludeEl &&
      !el.hasAttribute?.('data-kun-dnd-placeholder') &&
      el.getAttribute?.('data-kun-dnd-item') === 'true'
  )

  for (const el of children) {
    const rect = el.getBoundingClientRect()
    if (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    ) {
      return el
    }
  }

  return null
}

/**
 * Insert index for live transfer preview (FormKit-style): before the first
 * item whose midpoint is past the pointer; otherwise append.
 * @param {HTMLElement|null} parentEl
 * @param {number} clientX
 * @param {number} clientY
 * @param {'vertical'|'horizontal'|'grid'} [orientation='vertical']
 * @param {HTMLElement|null} [excludeEl=null]
 * @returns {number}
 */
export function getInsertIndexFromPoint(
  parentEl,
  clientX,
  clientY,
  orientation = 'vertical',
  excludeEl = null
) {
  if (!parentEl) return 0

  const children = [...parentEl.children].filter(
    (el) =>
      el !== excludeEl &&
      !el.hasAttribute?.('data-kun-dnd-placeholder') &&
      el.getAttribute?.('data-kun-dnd-item') === 'true'
  )
  if (!children.length) return 0

  for (let i = 0; i < children.length; i++) {
    const rect = children[i].getBoundingClientRect()
    if (orientation === 'horizontal') {
      if (clientX < rect.left + rect.width / 2) return i
    } else if (orientation === 'grid') {
      if (clientY < rect.top + rect.height / 2) return i
      if (
        clientY <= rect.bottom &&
        clientX < rect.left + rect.width / 2
      ) {
        return i
      }
    } else if (clientY < rect.top + rect.height / 2) {
      return i
    }
  }

  return children.length
}
