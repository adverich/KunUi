/**
 * Shared registry of KunDragAndDrop parents for cross-list transfer (FormKit-style `group`).
 * activeDrag is a shallowRef so every list can reactively style the dragged key
 * after live transfer (placeholder follows the item across parents).
 */
import { shallowRef, type ShallowRef } from 'vue'

export interface ActiveDragState {
    sourceId: string;
    group: string | null;
    itemKey: unknown;
    item: unknown;
    fromIndex: number;
}

export interface ParentEntry {
    id: string;
    group: string | null | undefined;
    getParentEl?: () => HTMLElement | null | undefined;
    getValues?: () => unknown[];
    setValues?: (next: unknown[], meta?: Record<string, unknown>) => void;
    getConfig?: () => Record<string, unknown>;
}

const groups = new Map<string, Set<ParentEntry>>()

export const activeDragRef: ShallowRef<ActiveDragState | null> = shallowRef(null)

export function getActiveDrag(): ActiveDragState | null {
  return activeDragRef.value
}

export function setActiveDrag(state: ActiveDragState | null): void {
  activeDragRef.value = state
}

export function clearActiveDrag(): void {
  activeDragRef.value = null
}

export function registerParent(entry: ParentEntry): void {
  if (!entry?.group) return
  let set = groups.get(entry.group)
  if (!set) {
    set = new Set()
    groups.set(entry.group, set)
  }
  set.add(entry)
}

export function unregisterParent(entry: ParentEntry): void {
  if (!entry?.group) return
  const set = groups.get(entry.group)
  if (!set) return
  set.delete(entry)
  if (!set.size) groups.delete(entry.group)
}

export function getGroupParents(group: string | null | undefined): ParentEntry[] {
  if (!group) return []
  const set = groups.get(group)
  return set ? [...set] : []
}

/**
 * Find which registered parent contains the event target.
 */
export function findParentEntryFromTarget(
  target: EventTarget | null | undefined,
  group: string | null | undefined,
): ParentEntry | null {
  const parents = getGroupParents(group)
  const t = target as HTMLElement | null | undefined;
  const el = t?.nodeType === 1 ? t : t?.parentElement
  if (!el) return null

  for (const entry of parents) {
    const parentEl = entry.getParentEl?.()
    if (parentEl && (parentEl === el || parentEl.contains(el))) {
      return entry
    }
  }
  return null
}
