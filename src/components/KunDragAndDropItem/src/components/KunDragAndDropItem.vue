<template>
  <component
    :is="tag"
    :data-kun-dnd-item="canParticipate ? 'true' : 'false'"
    :data-kun-dnd-key="resolvedKey"
    :draggable="htmlDraggable"
    :class="[
      wrapperClass,
      'kun-dnd-item transition-[transform,opacity,box-shadow] duration-150 ease-out',
      canParticipate ? 'cursor-grab active:cursor-grabbing' : '',
      isDragging ? draggingClass : '',
      isDragging ? dropZoneClass : '',
    ]"
  >
    <slot
      :item="item"
      :index="index"
      :dragging="isDragging"
      :draggable="canParticipate"
    />
  </component>
</template>

<script setup>
import { computed, inject } from 'vue'
import { kunDragAndDropItemProps } from '../composables/kunDragAndDropItemProps'
import { KUN_DRAG_AND_DROP_KEY } from '../../../KunDragAndDrop/src/composables/kunDragAndDropContext.js'

const props = defineProps(kunDragAndDropItemProps)

const ctx = inject(KUN_DRAG_AND_DROP_KEY, null)

const resolvedKey = computed(() => {
  if (props.itemKey != null) return String(props.itemKey)
  if (ctx?.resolveKey) return String(ctx.resolveKey(props.item, props.index))
  return String(props.index)
})

const draggingClass = computed(() => ctx?.draggingClass?.value ?? '')
const dropZoneClass = computed(() => ctx?.dropZoneClass?.value ?? 'kun-dnd-drop-zone')

const isDragging = computed(() => {
  const key = ctx?.draggingKey?.value
  return key != null && String(key) === resolvedKey.value
})

const canParticipate = computed(() => {
  if (props.disabled || ctx?.disabled?.value) return false
  if (ctx && ctx.sortable?.value === false) return false
  if (typeof ctx?.itemDraggable === 'function' && props.item != null) {
    return !!ctx.itemDraggable(props.item)
  }
  return true
})

/**
 * FormKit #139: with a drag handle, the node is only HTML5-draggable after
 * pointerdown on the handle arms it (armedKey).
 */
const htmlDraggable = computed(() => {
  if (!canParticipate.value) return false
  if (ctx?.hasDragHandle?.value) {
    return String(ctx.armedKey?.value) === resolvedKey.value
  }
  return true
})
</script>
