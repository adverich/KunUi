import { ref, watch, onMounted, onBeforeUnmount, isRef, unref, computed, type Ref, type ComputedRef } from 'vue'
import {
  resolveItemKey,
  performSort,
  performTransfer,
  getIncomingDirection,
  passesSortThreshold,
  getTargetItemFromPoint,
  getInsertIndexFromPoint,
} from '../utils/kunDragAndDropMath.js'
import {
  findScrollParent,
  getAutoScrollDelta,
} from '../utils/kunDragAndDropScroll.js'
import {
  registerParent,
  unregisterParent,
  getActiveDrag,
  setActiveDrag,
  clearActiveDrag,
  getGroupParents,
  activeDragRef,
  type ParentEntry,
} from './kunDragAndDropRegistry.js'

export const KUN_DND_HANDLE_ATTR = 'data-kun-dnd-handle'
export const KUN_DND_ITEM_ATTR = 'data-kun-dnd-item'
export const KUN_DND_KEY_ATTR = 'data-kun-dnd-key'

const INTERACTIVE_SELECTOR =
  'input,textarea,select,button,a,[role="button"],[data-no-drag]'

export type DragItemKey = string | ((item: unknown, index: number) => unknown);
export type DragCallback = (...args: any[]) => void;

export interface KunDragAndDropConfig {
  group: string | null;
  dragHandle: string | null;
  sortable: boolean;
  disabled: boolean;
  itemKey: DragItemKey;
  draggingClass: string;
  dropZoneClass: string;
  orientation: string;
  itemDraggable: ((item: unknown) => boolean) | null;
  threshold: { horizontal: number; vertical: number };
  onSort: DragCallback | null;
  onTransfer: DragCallback | null;
  onDragstart: DragCallback | null;
  onDragend: DragCallback | null;
  onValuesChange: DragCallback | null;
  autoScroll: boolean;
  scrollSensitivity: number;
  scrollSpeed: number;
}

export interface KunDragAndDropBindOptions {
  parent?: Ref<HTMLElement | null>;
  values?: Ref<unknown[]>;
  [key: string]: unknown;
}

let idSeq = 0
function nextId(): string {
  idSeq += 1
  return `kun-dnd-${idSeq}`
}

function isBindOptions(arg: unknown): arg is KunDragAndDropBindOptions {
  return (
    arg != null &&
    typeof arg === 'object' &&
    !Array.isArray(arg) &&
    ('parent' in (arg as Record<string, unknown>) || 'values' in (arg as Record<string, unknown>))
  )
}

function asCallback(fn: unknown): DragCallback | null {
  return typeof fn === 'function' ? (fn as DragCallback) : null;
}

function normalizeConfig(raw: Record<string, unknown> = {}): KunDragAndDropConfig {
  return {
    group: (raw.group as string | null) ?? null,
    dragHandle: (raw.dragHandle as string | null) ?? null,
    sortable: raw.sortable !== false,
    disabled: !!raw.disabled,
    itemKey: (raw.itemKey as DragItemKey) ?? 'id',
    draggingClass: (raw.draggingClass as string) ?? '',
    dropZoneClass: (raw.dropZoneClass as string) ?? 'kun-dnd-drop-zone',
    /** 'vertical' | 'horizontal' | 'grid' — list rows must be vertical (wide items broke handle drag). */
    orientation: (raw.orientation as string) || 'vertical',
    itemDraggable: typeof raw.itemDraggable === 'function' ? (raw.itemDraggable as (item: unknown) => boolean) : null,
    // FormKit default is 0; keep a tiny grid dead-zone only when orientation is grid
    threshold: {
      horizontal: (raw.threshold as { horizontal?: number } | undefined)?.horizontal ?? 0,
      vertical: (raw.threshold as { vertical?: number } | undefined)?.vertical ?? 0,
    },
    onSort: asCallback(raw.onSort),
    onTransfer: asCallback(raw.onTransfer),
    onDragstart: asCallback(raw.onDragstart),
    onDragend: asCallback(raw.onDragend),
    onValuesChange: asCallback(raw.onValuesChange),
    /** Edge auto-scroll while dragging (HTML5 DnD blocks mouse wheel). */
    autoScroll: raw.autoScroll !== false,
    scrollSensitivity: Number.isFinite(raw.scrollSensitivity) ? (raw.scrollSensitivity as number) : 50,
    scrollSpeed: Number.isFinite(raw.scrollSpeed) ? (raw.scrollSpeed as number) : 12,
  }
}

function arraysEqualByKey(a: unknown[] | null | undefined, b: unknown[] | null | undefined, itemKey: DragItemKey): boolean {
  if (a === b) return true
  if (!a || !b || a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (resolveItemKey(a[i], itemKey, i) !== resolveItemKey(b[i], itemKey, i)) {
      return false
    }
  }
  return true
}

function escapeAttr(value: unknown): string {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return CSS.escape(String(value))
  }
  return String(value).replace(/"/g, '\\"')
}

/**
 * FormKit-style handle check: composedPath + elementFromPoint fallback.
 */
export function validateDragHandle(e: DragEvent | PointerEvent, nodeEl: HTMLElement, dragHandleSelector: string): boolean {
  if (!dragHandleSelector) return true

  const path = typeof e.composedPath === 'function' ? e.composedPath() : []
  const nodeIndex = path.indexOf(nodeEl)
  const slice = nodeIndex === -1 ? [] : path.slice(0, nodeIndex)

  for (const target of slice) {
    if (target instanceof Element && target.matches(dragHandleSelector)) {
      return true
    }
  }

  const handles = nodeEl.querySelectorAll(dragHandleSelector)
  const elFromPoint = document.elementFromPoint(e.clientX, e.clientY)
  if (!elFromPoint) return false

  for (const handle of handles) {
    if (elFromPoint === handle || handle.contains(elFromPoint)) return true
  }
  return false
}

/**
 * FormKit-inspired data-first drag and drop.
 *
 * @returns {[import('vue').Ref, import('vue').Ref, (partial: object) => void, { draggingKey: import('vue').Ref, armedKey: import('vue').Ref, hasDragHandle: import('vue').ComputedRef|import('vue').Ref }]}
 */
export function useKunDragAndDrop(initialOrOptions?: unknown[] | KunDragAndDropBindOptions, maybeConfig?: Record<string, unknown>) {
  const bindMode = isBindOptions(initialOrOptions)
  const options = (bindMode ? initialOrOptions : {}) as KunDragAndDropBindOptions
  const initialConfig = normalizeConfig(bindMode ? (options as unknown as Record<string, unknown>) : maybeConfig || {})

  const instanceId = nextId()
  const configRef: Ref<KunDragAndDropConfig> = ref({ ...initialConfig })

  const parentRef: Ref<HTMLElement | null> = (bindMode && options.parent ? options.parent : ref(null)) as Ref<HTMLElement | null>
  const items: Ref<unknown[]> =
    bindMode && options.values
      ? options.values
      : ref(Array.isArray(initialOrOptions) ? [...initialOrOptions] : [])

  /**
   * Shared across grouped lists so the drop-zone placeholder follows the item
   * after live transfer (local ref alone would leave the wrong list styling).
   */
  const draggingKey: ComputedRef<string | number | null> = computed(() => (activeDragRef.value?.itemKey as string | number | null) ?? null)
  /** When dragHandle is set, only the armed item is HTML5-draggable (FormKit #139). */
  const armedKey: Ref<string | null> = ref(null)

  let entry: ParentEntry | null = null
  let boundEl: HTMLElement | null = null
  let dragOverRaf: number | null = null
  let currentTargetKey: string | number | null = null
  let dragImageEl: HTMLElement | null = null
  /** Timestamp — block sorts/transfers briefly after a move to prevent A↔B crash loops */
  let sortQuietUntil = 0
  /** Dedup live transfer when pointer stays on the same insert slot */
  let lastTransferSig: string | null = null
  let autoScrollRaf: number | null = null
  let autoScrollDx = 0
  let autoScrollDy = 0
  let autoScrollEl: Element | null = null
  let documentDragOverBound = false

  function getValues(): unknown[] {
    return unref(items) || []
  }

  function setValues(next: unknown, meta: Record<string, unknown> = {}): void {
    const list = Array.isArray(next) ? next : []
    if (isRef(items)) {
      (items as Ref<unknown[]>).value = list
    }
    getConfig().onValuesChange?.(list, meta)
  }

  function getParentEl(): HTMLElement | null {
    return unref(parentRef) || null
  }

  function getConfig(): KunDragAndDropConfig {
    return configRef.value
  }

  function updateConfig(partial: Record<string, unknown> = {}): void {
    configRef.value = normalizeConfig({ ...configRef.value, ...partial })
    syncRegistry()
  }

  function syncRegistry(): void {
    if (entry) unregisterParent(entry)
    entry = {
      id: instanceId,
      group: configRef.value.group,
      getParentEl,
      getValues,
      setValues,
      getConfig: getConfig as unknown as () => Record<string, unknown>,
    }
    registerParent(entry)
  }

  function findIndexByKey(key: unknown): number {
    const cfg = getConfig()
    return getValues().findIndex(
      (item: unknown, i: number) => String(resolveItemKey(item, cfg.itemKey, i)) === String(key)
    )
  }

  function getItemElFromEvent(e: Event): HTMLElement | null {
    const parentEl = getParentEl()
    const target = e?.target as HTMLElement | null;
    if (!parentEl || !target?.closest) return null
    const itemEl = target.closest(`[${KUN_DND_ITEM_ATTR}="true"]`)
    if (!itemEl || !parentEl.contains(itemEl)) return null
    return itemEl as HTMLElement
  }

  function getDraggedEl(key: unknown): HTMLElement | null {
    const parentEl = getParentEl()
    if (!parentEl || key == null) return null
    return parentEl.querySelector(`[${KUN_DND_KEY_ATTR}="${escapeAttr(key)}"]`)
  }

  /**
   * Strip leftover drop-zone/dragging classes from every item in this parent.
   * Manual classList mutations used to stick on the wrong sibling after sort;
   * visuals are Vue-driven now — this is a safety net on dragend.
   */
  function clearParentVisualClasses(): void {
    const parentEl = getParentEl()
    const cfg = getConfig()
    if (!parentEl) return
    const classNames = [
      ...(cfg.draggingClass || '').split(/\s+/),
      ...(cfg.dropZoneClass || '').split(/\s+/),
    ].filter(Boolean)
    if (!classNames.length) return
    parentEl.querySelectorAll(`[${KUN_DND_ITEM_ATTR}="true"]`).forEach((el: Element) => {
      classNames.forEach((c: string) => el.classList.remove(c))
    })
  }

  function clearGroupVisualClasses(): void {
    const drag = getActiveDrag()
    const parents = drag?.group ? getGroupParents(drag.group) : []
    if (parents.length) {
      parents.forEach((p: ParentEntry) => {
        const el = p.getParentEl?.()
        const cfg = (p.getConfig?.() || getConfig()) as unknown as KunDragAndDropConfig
        if (!el) return
        const classNames = [
          ...(cfg.draggingClass || '').split(/\s+/),
          ...(cfg.dropZoneClass || '').split(/\s+/),
        ].filter(Boolean)
        el.querySelectorAll(`[${KUN_DND_ITEM_ATTR}="true"]`).forEach((node: Element) => {
          classNames.forEach((c: string) => node.classList.remove(c))
        })
      })
    } else {
      clearParentVisualClasses()
    }
  }

  function clearDraggingVisual(): void {
    clearGroupVisualClasses()
    armedKey.value = null
    currentTargetKey = null
    sortQuietUntil = 0
    lastTransferSig = null
    stopAutoScroll()
    if (dragImageEl?.parentNode) {
      dragImageEl.parentNode.removeChild(dragImageEl)
    }
    dragImageEl = null
  }

  function stopAutoScroll(): void {
    autoScrollDx = 0
    autoScrollDy = 0
    autoScrollEl = null
    if (autoScrollRaf != null) {
      cancelAnimationFrame(autoScrollRaf)
      autoScrollRaf = null
    }
  }

  function tickAutoScroll(): void {
    autoScrollRaf = null
    if (!getActiveDrag() || !autoScrollEl) {
      stopAutoScroll()
      return
    }
    if (autoScrollDx === 0 && autoScrollDy === 0) return

    const scrollTarget = autoScrollEl as HTMLElement | null;
    if (autoScrollDy !== 0 && scrollTarget) {
      scrollTarget.scrollTop += autoScrollDy
    }
    if (autoScrollDx !== 0 && scrollTarget) {
      scrollTarget.scrollLeft += autoScrollDx
    }
    autoScrollRaf = requestAnimationFrame(tickAutoScroll)
  }

  /**
   * Edge auto-scroll of the nearest overflow ancestor (HTML5 DnD blocks wheel).
   */
  function updateAutoScroll(clientX: number, clientY: number): void {
    const cfg = getConfig()
    if (!cfg.autoScroll || !getActiveDrag()) {
      stopAutoScroll()
      return
    }

    let under = null
    try {
      under = document.elementFromPoint(clientX, clientY)
    } catch {
      /* ignore */
    }
    const scrollEl =
      findScrollParent(under) || findScrollParent(getParentEl())
    autoScrollEl = scrollEl
    const { dx, dy } = getAutoScrollDelta(clientX, clientY, scrollEl, {
      sensitivity: cfg.scrollSensitivity,
      speed: cfg.scrollSpeed,
    })
    autoScrollDx = dx
    autoScrollDy = dy

    if ((dx !== 0 || dy !== 0) && autoScrollRaf == null) {
      autoScrollRaf = requestAnimationFrame(tickAutoScroll)
    }
    if (dx === 0 && dy === 0 && autoScrollRaf != null) {
      cancelAnimationFrame(autoScrollRaf)
      autoScrollRaf = null
    }
  }

  function onDocumentDragOver(e: DragEvent): void {
    // Session binder keeps auto-scroll alive even after live transfer ownership moves
    if (!documentDragOverBound || !getActiveDrag()) return
    e.preventDefault()
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
    updateAutoScroll(e.clientX, e.clientY)
  }

  function bindDocumentDragSession(): void {
    if (documentDragOverBound) return
    documentDragOverBound = true
    document.addEventListener('dragover', onDocumentDragOver, true)
    document.addEventListener('dragend', onDocumentDragEnd, true)
  }

  function unbindDocumentDragSession(): void {
    if (!documentDragOverBound) return
    documentDragOverBound = false
    document.removeEventListener('dragover', onDocumentDragOver, true)
    document.removeEventListener('dragend', onDocumentDragEnd, true)
  }

  function warnChildCountMismatch() {
    try {
      if (import.meta.env?.PROD) return
    } catch {
      /* ignore */
    }
    const parentEl = getParentEl()
    if (!parentEl) return
    const childCount = [...parentEl.children].filter(
      (el: Element) =>
        el.getAttribute?.(KUN_DND_ITEM_ATTR) === 'true' &&
        !el.hasAttribute?.('data-kun-dnd-placeholder')
    ).length
    const valueCount = getValues().length
    if (childCount !== valueCount) {
      console.warn(
        '[KunDragAndDrop] The number of draggable items in the parent does not match the number of values, which may lead to unexpected behavior.',
        { childCount, valueCount }
      )
    }
  }

  /**
   * FormKit: with dragHandle, node.draggable stays false until pointerdown on handle.
   */
  function onPointerDown(e: PointerEvent): void {
    const cfg = getConfig()
    if (cfg.disabled || !cfg.sortable) return

    const itemEl = getItemElFromEvent(e)
    if (!itemEl) {
      armedKey.value = null
      return
    }

    if (cfg.dragHandle) {
      if (!validateDragHandle(e, itemEl, cfg.dragHandle)) {
        armedKey.value = null
        itemEl.draggable = false
        return
      }
      const key = itemEl.getAttribute(KUN_DND_KEY_ATTR)
      armedKey.value = key
      itemEl.draggable = true
      return
    }

    // No handle: block interactive controls from starting a drag
    const downTarget = e.target as HTMLElement | null;
    if (downTarget?.closest?.(INTERACTIVE_SELECTOR)) {
      itemEl.draggable = false
      armedKey.value = null
      return
    }
    itemEl.draggable = true
    armedKey.value = itemEl.getAttribute(KUN_DND_KEY_ATTR)
  }

  function onPointerUp() {
    const cfg = getConfig()
    if (!cfg.dragHandle) return
    const el = getDraggedEl(armedKey.value)
    if (el && !draggingKey.value) {
      el.draggable = false
      armedKey.value = null
    }
  }

  function onDragStart(e: DragEvent): void {
    const cfg = getConfig()
    if (cfg.disabled || !cfg.sortable) {
      e.preventDefault()
      return
    }

    const itemEl = getItemElFromEvent(e)
    if (!itemEl) {
      e.preventDefault()
      return
    }

    if (cfg.dragHandle) {
      if (!validateDragHandle(e, itemEl, cfg.dragHandle)) {
        e.preventDefault()
        itemEl.draggable = false
        return
      }
    } else if ((e.target as HTMLElement | null)?.closest?.(INTERACTIVE_SELECTOR)) {
      e.preventDefault()
      return
    }

    const key = itemEl.getAttribute(KUN_DND_KEY_ATTR)
    const fromIndex = findIndexByKey(key)
    if (fromIndex < 0) {
      e.preventDefault()
      return
    }

    const item = getValues()[fromIndex]
    if (cfg.itemDraggable && !cfg.itemDraggable(item)) {
      e.preventDefault()
      return
    }

    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', String(key))
      // FormKit look: floating clone follows cursor; in-list node stays as faded placeholder
      try {
        const rect = itemEl.getBoundingClientRect()
        const clone = itemEl.cloneNode(true) as HTMLElement
        clone.querySelectorAll('[id]').forEach((n: Element) => n.removeAttribute('id'))
        clone.setAttribute('aria-hidden', 'true')
        Object.assign(clone.style, {
          position: 'fixed',
          top: '-10000px',
          left: '-10000px',
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          margin: '0',
          boxSizing: 'border-box',
          pointerEvents: 'none',
          opacity: '1',
          zIndex: '9999',
          transform: 'none',
        })
        clone.classList.remove(
          ...(cfg.draggingClass || '').split(/\s+/).filter(Boolean),
          ...(cfg.dropZoneClass || '').split(/\s+/).filter(Boolean)
        )
        document.body.appendChild(clone)
        dragImageEl = clone
        const ox = typeof e.offsetX === 'number' ? e.offsetX : rect.width / 2
        const oy = typeof e.offsetY === 'number' ? e.offsetY : rect.height / 2
        e.dataTransfer.setDragImage(clone, ox, oy)
      } catch {
        /* ignore */
      }
    }

    armedKey.value = key
    currentTargetKey = null
    lastTransferSig = null

    setActiveDrag({
      sourceId: instanceId,
      group: cfg.group,
      itemKey: key,
      item,
      fromIndex,
    })

    bindDocumentDragSession()

    cfg.onDragstart?.({
      item,
      index: fromIndex,
      key,
      event: e,
    })
  }

  /**
   * Sort gate: orientation-aware (lists = vertical only — wide rows were
   * incorrectly using X threshold, so handle/left-side drags never committed).
   * Anti-crash: never clear currentTargetKey just to re-sort in the same frame.
   */
  function validateSortTarget(targetEl: HTMLElement | null, dragEl: HTMLElement | null, x: number, y: number, fromIndex: number, targetIndex: number): boolean {
    if (!targetEl || !dragEl || targetEl === dragEl) return false
    if (fromIndex < 0 || targetIndex < 0 || fromIndex === targetIndex) return false

    const targetKey = targetEl.getAttribute(KUN_DND_KEY_ATTR)
    if (targetKey == null) return false
    if (String(targetKey) === String(currentTargetKey)) return false

    const cfg = getConfig()
    const rect = targetEl.getBoundingClientRect()
    const th = cfg.threshold || { horizontal: 0, vertical: 0 }
    const orientation = cfg.orientation || 'vertical'
    const movingForward = fromIndex < targetIndex

    if (orientation === 'vertical') {
      const edge = rect.height * (th.vertical ?? 0)
      if (movingForward) {
        if (y < rect.top + edge) return false
      } else if (y > rect.bottom - edge) {
        return false
      }
      return true
    }

    if (orientation === 'horizontal') {
      const edge = rect.width * (th.horizontal ?? 0)
      if (movingForward) {
        if (x < rect.left + edge) return false
      } else if (x > rect.right - edge) {
        return false
      }
      return true
    }

    // grid: FormKit incomingDirection from element positions + pointer threshold
    const dragRect = dragEl.getBoundingClientRect()
    const incoming = getIncomingDirection(dragRect, rect)
    return passesSortThreshold(incoming, rect, x, y, th)
  }

  function applySortToTarget(targetEl: HTMLElement, event: DragEvent): void {
    const cfg = getConfig()
    const drag = getActiveDrag()
    if (!drag || drag.sourceId !== instanceId) return

    const targetKey = targetEl.getAttribute(KUN_DND_KEY_ATTR)
    const fromIndex = findIndexByKey(drag.itemKey)
    const targetIndex = findIndexByKey(targetKey)
    if (fromIndex < 0 || targetIndex < 0 || fromIndex === targetIndex) return

    if (
      !validateSortTarget(
        targetEl,
        getDraggedEl(drag.itemKey),
        event.clientX,
        event.clientY,
        fromIndex,
        targetIndex
      )
    ) {
      return
    }

    const prev = getValues()
    const next = performSort(prev, fromIndex, targetIndex)
    if (arraysEqualByKey(next, prev, cfg.itemKey)) return

    // Lock this target; quiet window absorbs DOM reflow under a still cursor
    currentTargetKey = targetKey
    sortQuietUntil = performance.now() + 80

    const newIndex = next.findIndex(
      (it, i) => String(resolveItemKey(it, cfg.itemKey, i)) === String(drag.itemKey)
    )

    setValues(next, { reason: 'sort' })
    setActiveDrag({ ...drag, fromIndex: newIndex })

    cfg.onSort?.({
      item: drag.item,
      fromIndex,
      toIndex: newIndex,
      previousPosition: fromIndex,
      position: newIndex,
      items: next,
      event,
    })
  }

  /**
   * FormKit live transfer: move the value into this list on dragover so siblings
   * shift and the faded placeholder shows the insert destination.
   */
  function applyLiveTransfer(event: DragEvent): void {
    const cfg = getConfig()
    const drag = getActiveDrag()
    if (!drag || drag.sourceId === instanceId) return
    if (!cfg.group || cfg.group !== drag.group) return
    if (performance.now() < sortQuietUntil) return

    const sourceEntry = getGroupParents(drag.group).find(
      (p) => p.id === drag.sourceId
    )
    if (!sourceEntry) return

    const parentEl = getParentEl()
    const dragEl = getDraggedEl(drag.itemKey)
    const insertIndex = getInsertIndexFromPoint(
      parentEl,
      event.clientX,
      event.clientY,
      (cfg.orientation as 'vertical' | 'horizontal' | 'grid') || 'vertical',
      dragEl
    )

    const sig = `${drag.sourceId}:${insertIndex}:${drag.itemKey}`
    if (sig === lastTransferSig) return

    const sourceValues = sourceEntry.getValues?.() ?? [];
    const sourceCfg = sourceEntry.getConfig?.() as unknown as KunDragAndDropConfig;
    const fromIndex = sourceValues.findIndex((item: unknown, i: number) => {
      const key = resolveItemKey(item, sourceCfg.itemKey, i)
      return String(key) === String(drag.itemKey)
    })
    if (fromIndex < 0) return

    const { source, target, item } = performTransfer(
      sourceValues,
      fromIndex,
      getValues(),
      insertIndex
    )
    if (item === undefined) return

    lastTransferSig = sig
    currentTargetKey = null
    sortQuietUntil = performance.now() + 80

    sourceEntry.setValues?.(source, { reason: 'transfer-out' })
    setValues(target, { reason: 'transfer-in' })

    // This list now owns the drag — further dragover sorts in-place
    setActiveDrag({
      ...drag,
      sourceId: instanceId,
      fromIndex: insertIndex,
      item,
    })

    cfg.onTransfer?.({
      item,
      fromIndex,
      toIndex: insertIndex,
      sourceItems: source,
      targetItems: target,
      event,
    })
  }

  function onDragOver(e: DragEvent): void {
    const cfg = getConfig()
    const drag = getActiveDrag()
    if (!drag || cfg.disabled) return

    const isSelf = drag.sourceId === instanceId
    const sameGroup = !!cfg.group && cfg.group === drag.group

    if (!isSelf && !sameGroup) return

    e.preventDefault()
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
    updateAutoScroll(e.clientX, e.clientY)

    if (dragOverRaf) return
    dragOverRaf = requestAnimationFrame(() => {
      dragOverRaf = null
      const current = getActiveDrag()
      if (!current) return

      const stillSelf = current.sourceId === instanceId
      const stillGroup = !!cfg.group && cfg.group === current.group

      if (stillSelf && cfg.sortable) {
        const parentEl = getParentEl()
        const dragEl = getDraggedEl(current.itemKey)
        const targetEl = getTargetItemFromPoint(
          parentEl,
          e.clientX,
          e.clientY,
          dragEl
        )

        if (!targetEl) {
          currentTargetKey = null
          return
        }

        // After a sort, DOM jumps under the cursor — sync lock, do not sort again yet
        if (performance.now() < sortQuietUntil) {
          currentTargetKey = targetEl.getAttribute(KUN_DND_KEY_ATTR)
          return
        }

        applySortToTarget(targetEl, e)
        return
      }

      if (!stillSelf && stillGroup) {
        applyLiveTransfer(e)
      }
    })
  }

  function onDrop(e: DragEvent): void {
    e.preventDefault()
    // Live transfer already moved the item on dragover; drop is a no-op safety net
    // if the browser skipped dragover on an empty list.
    const cfg = getConfig()
    const drag = getActiveDrag()
    if (!drag || cfg.disabled) return
    if (drag.sourceId === instanceId) return
    applyLiveTransfer(e)
  }

  function finishDrag(e: Event): void {
    const drag = getActiveDrag()
    if (!drag && !dragImageEl) {
      armedKey.value = null
      stopAutoScroll()
      unbindDocumentDragSession()
      return
    }

    const cfg = getConfig()
    const key = drag?.itemKey ?? draggingKey.value
    const index = key != null ? findIndexByKey(key) : -1
    const item = index >= 0 ? getValues()[index] : drag?.item

    const el = key != null ? getDraggedEl(key) : null
    if (cfg.dragHandle && el) {
      el.draggable = false
    }

    clearDraggingVisual()
    clearActiveDrag()
    unbindDocumentDragSession()

    cfg.onDragend?.({
      item,
      index,
      key,
      event: e,
    })
  }

  function onDragEnd(e: DragEvent): void {
    finishDrag(e)
  }

  function onDocumentDragEnd(e: DragEvent): void {
    finishDrag(e)
  }

  function bindParent(el: HTMLElement | null): void {
    if (boundEl === el) return
    unbindParent()
    boundEl = el
    if (!el) return
    el.addEventListener('pointerdown', onPointerDown, true)
    el.addEventListener('pointerup', onPointerUp, true)
    el.addEventListener('pointercancel', onPointerUp, true)
    el.addEventListener('dragstart', onDragStart)
    el.addEventListener('dragover', onDragOver)
    el.addEventListener('drop', onDrop)
    el.addEventListener('dragend', onDragEnd)
  }

  function unbindParent(): void {
    if (!boundEl) return
    boundEl.removeEventListener('pointerdown', onPointerDown, true)
    boundEl.removeEventListener('pointerup', onPointerUp, true)
    boundEl.removeEventListener('pointercancel', onPointerUp, true)
    boundEl.removeEventListener('dragstart', onDragStart)
    boundEl.removeEventListener('dragover', onDragOver)
    boundEl.removeEventListener('drop', onDrop)
    boundEl.removeEventListener('dragend', onDragEnd)
    boundEl = null
  }

  watch(
    () => unref(parentRef),
    (el: HTMLElement | null) => {
      bindParent(el)
      if (el) warnChildCountMismatch()
    },
    { flush: 'post' }
  )

  watch(
    () => getValues().length,
    () => {
      warnChildCountMismatch()
    }
  )

  onMounted(() => {
    syncRegistry()
    bindParent(getParentEl())
    warnChildCountMismatch()
  })

  onBeforeUnmount(() => {
    if (dragOverRaf) cancelAnimationFrame(dragOverRaf)
    stopAutoScroll()
    unbindDocumentDragSession()
    unbindParent()
    if (entry) unregisterParent(entry)
    entry = null
    if (getActiveDrag()?.sourceId === instanceId) clearActiveDrag()
  })

  const hasDragHandle = ref<boolean>(!!initialConfig.dragHandle)
  watch(
    () => !!getConfig().dragHandle,
    (v: boolean) => {
      hasDragHandle.value = v
    }
  )

  return [
    parentRef,
    items,
    updateConfig,
    { draggingKey, armedKey, hasDragHandle },
  ] as const
}

export { resolveItemKey }
