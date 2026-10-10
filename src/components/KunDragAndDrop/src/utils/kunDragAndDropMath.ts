/**
 * Resolve a stable key for a list item.
 */
export function resolveItemKey(item: unknown, itemKey: string | ((item: unknown, index: number) => unknown) = 'id', index = 0): unknown {
  if (typeof itemKey === 'function') return itemKey(item, index)
  if (item != null && typeof item === 'object' && itemKey != null) {
    const key = (item as Record<string, unknown>)[itemKey as string]
    if (key != null) return key
  }
  return item
}

/**
 * FormKit performSort: remove dragged value(s), splice at targetIndex.
 */
export function performSort<T>(items: T[], fromIndex: number, targetIndex: number): T[] {
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

export function performTransfer<T>(
  sourceItems: T[] | null | undefined,
  fromIndex: number,
  targetItems: T[] | null | undefined,
  targetIndex: number,
): { source: T[]; target: T[]; item: T | undefined } {
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

export type IncomingDirection = 'above' | 'below' | 'left' | 'right';

/**
 * Relative position of dragged rect vs target rect (FormKit incomingDirection).
 */
export function getIncomingDirection(dragRect: DOMRect, targetRect: DOMRect): IncomingDirection {
  const yDiff = targetRect.y - dragRect.y
  const xDiff = targetRect.x - dragRect.x
  if (Math.abs(yDiff) > Math.abs(xDiff)) {
    return yDiff > 0 ? 'above' : 'below'
  }
  return xDiff > 0 ? 'left' : 'right'
}

export interface SortThreshold { horizontal?: number; vertical?: number }

/**
 * FormKit validateSort threshold gate.
 */
export function passesSortThreshold(
  incomingDirection: IncomingDirection,
  targetRect: DOMRect,
  x: number,
  y: number,
  threshold: SortThreshold = {},
): boolean {
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
 */
export function getTargetItemFromPoint(
  parentEl: HTMLElement | null | undefined,
  clientX: number,
  clientY: number,
  excludeEl: HTMLElement | null = null,
): HTMLElement | null {
  if (!parentEl) return null

  const children = [...parentEl.children].filter(
    (el) =>
      el !== excludeEl &&
      !el.hasAttribute?.('data-kun-dnd-placeholder') &&
      el.getAttribute?.('data-kun-dnd-item') === 'true'
  )

  for (const el of children) {
    const rect = (el as HTMLElement).getBoundingClientRect()
    if (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    ) {
      return el as HTMLElement
    }
  }

  return null
}

/**
 * Insert index for live transfer preview (FormKit-style): before the first
 * item whose midpoint is past the pointer; otherwise append.
 */
export function getInsertIndexFromPoint(
  parentEl: HTMLElement | null | undefined,
  clientX: number,
  clientY: number,
  orientation: 'vertical' | 'horizontal' | 'grid' = 'vertical',
  excludeEl: HTMLElement | null = null,
): number {
  if (!parentEl) return 0

  const children = [...parentEl.children].filter(
    (el) =>
      el !== excludeEl &&
      !el.hasAttribute?.('data-kun-dnd-placeholder') &&
      el.getAttribute?.('data-kun-dnd-item') === 'true'
  )
  if (!children.length) return 0

  for (let i = 0; i < children.length; i++) {
    const rect = (children[i] as HTMLElement).getBoundingClientRect()
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
