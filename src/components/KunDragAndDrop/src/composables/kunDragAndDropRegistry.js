/**
 * Shared registry of KunDragAndDrop parents for cross-list transfer (FormKit-style `group`).
 * activeDrag is a shallowRef so every list can reactively style the dragged key
 * after live transfer (placeholder follows the item across parents).
 */
import { shallowRef } from 'vue'

/** @type {Map<string, Set<object>>} */
const groups = new Map()

/**
 * @type {import('vue').ShallowRef<{ sourceId: string, group: string|null, itemKey: *, item: *, fromIndex: number }|null>}
 */
export const activeDragRef = shallowRef(null)

export function getActiveDrag() {
  return activeDragRef.value
}

export function setActiveDrag(state) {
  activeDragRef.value = state
}

export function clearActiveDrag() {
  activeDragRef.value = null
}

/**
 * @param {object} entry
 * @param {string} entry.id
 * @param {string|null|undefined} entry.group
 * @param {() => HTMLElement|null|undefined} entry.getParentEl
 * @param {() => any[]} entry.getValues
 * @param {(next: any[]) => void} entry.setValues
 * @param {() => object} entry.getConfig
 */
export function registerParent(entry) {
  if (!entry?.group) return
  let set = groups.get(entry.group)
  if (!set) {
    set = new Set()
    groups.set(entry.group, set)
  }
  set.add(entry)
}

/**
 * @param {object} entry
 */
export function unregisterParent(entry) {
  if (!entry?.group) return
  const set = groups.get(entry.group)
  if (!set) return
  set.delete(entry)
  if (!set.size) groups.delete(entry.group)
}

/**
 * @param {string|null|undefined} group
 * @returns {object[]}
 */
export function getGroupParents(group) {
  if (!group) return []
  const set = groups.get(group)
  return set ? [...set] : []
}

/**
 * Find which registered parent contains the event target.
 * @param {EventTarget|null} target
 * @param {string|null|undefined} group
 */
export function findParentEntryFromTarget(target, group) {
  const parents = getGroupParents(group)
  const el = target?.nodeType === 1 ? target : target?.parentElement
  if (!el) return null

  for (const entry of parents) {
    const parentEl = entry.getParentEl?.()
    if (parentEl && (parentEl === el || parentEl.contains(el))) {
      return entry
    }
  }
  return null
}
