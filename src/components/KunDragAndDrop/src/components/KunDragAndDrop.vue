<template>
  <component
    :is="tag"
    :ref="setParentRef"
    :class="[layoutClass, wrapperClass, 'kun-dnd-parent']"
  >
    <template v-if="list.length">
      <slot
        v-for="(item, index) in list"
        :key="resolveKey(item, index)"
        name="item"
        :item="item"
        :index="index"
        :dragging="isItemDragging(item, index)"
      >
        <KunDragAndDropItem
          :item="item"
          :index="index"
          :item-key="resolveKey(item, index)"
          :disabled="isItemDisabled(item)"
          class="rounded-lg border border-surface bg-surface-light px-3 py-2"
        >
          <div class="flex items-center gap-2 min-w-0">
            <slot name="handle" :item="item" :index="index">
              <KunDragAndDropHandle />
            </slot>
            <div class="flex-1 min-w-0 truncate">
              <slot :item="item" :index="index">
                {{ displayLabel(item) }}
              </slot>
            </div>
          </div>
        </KunDragAndDropItem>
      </slot>
    </template>
    <slot v-else name="empty">
      <div data-kun-dnd-placeholder data-kun-dnd-item="false" class="text-sm text-ui-muted opacity-70 py-2">
        Sin elementos
      </div>
    </slot>
  </component>
</template>

<script setup>
import { computed, provide, ref, watch } from 'vue'
import { kunDragAndDropProps } from '../composables/kunDragAndDropProps'
import { KUN_DRAG_AND_DROP_KEY } from '../composables/kunDragAndDropContext.js'
import {
  useKunDragAndDrop,
  resolveItemKey,
} from '../composables/useKunDragAndDrop.js'
import { activeDragRef } from '../composables/kunDragAndDropRegistry.js'
import KunDragAndDropItem from '../../../KunDragAndDropItem/src/components/KunDragAndDropItem.vue'
import KunDragAndDropHandle from '../../../KunDragAndDropHandle/src/components/KunDragAndDropHandle.vue'

const props = defineProps(kunDragAndDropProps)
const emit = defineEmits([
  'update:modelValue',
  'update:items',
  'drag-start',
  'drag-end',
  'sort',
  'transfer',
])

const parentEl = ref(null)

function setParentRef(el) {
  parentEl.value = el || null
}

const sourceItems = computed(() => {
  if (props.modelValue !== undefined) return props.modelValue || []
  if (props.items !== undefined) return props.items || []
  return []
})

const internalItems = ref([...sourceItems.value])

watch(
  sourceItems,
  (next) => {
    internalItems.value = Array.isArray(next) ? [...next] : []
  },
  { deep: true }
)

const dragHandleSelector = computed(() => props.dragHandle || null)

function emitUpdates(list) {
  emit('update:modelValue', list)
  emit('update:items', list)
}

function buildConfig() {
  return {
    group: props.group,
    sortable: props.sortable,
    disabled: props.disabled,
    itemKey: props.itemKey,
    draggingClass: props.draggingClass,
    dropZoneClass: props.dropZoneClass,
    threshold: props.threshold,
    orientation:
      props.orientation || (props.layout === 'grid' ? 'grid' : 'vertical'),
    itemDraggable: props.itemDraggable,
    dragHandle: dragHandleSelector.value,
    autoScroll: props.autoScroll,
    scrollSensitivity: props.scrollSensitivity,
    scrollSpeed: props.scrollSpeed,
    onDragstart: (payload) => emit('drag-start', payload),
    onDragend: (payload) => emit('drag-end', payload),
    onSort: (payload) => {
      emit('sort', payload)
      emitUpdates(payload.items)
    },
    onTransfer: (payload) => {
      emit('transfer', payload)
      emitUpdates(payload.targetItems)
    },
    onValuesChange: (list, changeMeta) => {
      if (changeMeta?.reason === 'transfer-out') {
        emitUpdates(list)
      }
    },
  }
}

const [, , updateConfig, meta] = useKunDragAndDrop({
  parent: parentEl,
  values: internalItems,
  ...buildConfig(),
})

watch(
  () => [
    props.group,
    props.sortable,
    props.disabled,
    props.itemKey,
    props.draggingClass,
    props.dropZoneClass,
    props.threshold,
    props.orientation,
    props.layout,
    props.itemDraggable,
    props.autoScroll,
    props.scrollSensitivity,
    props.scrollSpeed,
    dragHandleSelector.value,
  ],
  () => {
    updateConfig(buildConfig())
  }
)

const list = computed(() => internalItems.value)

const layoutClass = computed(() => {
  if (props.layout === 'grid') return props.gridClass
  return props.listClass
})

function resolveKey(item, index) {
  return resolveItemKey(item, props.itemKey, index)
}

function isItemDragging(item, index) {
  const key = activeDragRef.value?.itemKey
  return key != null && String(key) === String(resolveKey(item, index))
}

function isItemDisabled(item) {
  if (props.disabled) return true
  if (typeof props.itemDraggable === 'function') return !props.itemDraggable(item)
  return false
}

function displayLabel(item) {
  if (item == null) return ''
  if (typeof item === 'string' || typeof item === 'number') return String(item)
  return item.title ?? item.name ?? item.label ?? resolveKey(item, 0)
}

const sharedDraggingKey = computed(() => activeDragRef.value?.itemKey ?? null)

provide(KUN_DRAG_AND_DROP_KEY, {
  resolveKey: (item, index) => resolveKey(item, index),
  draggingKey: sharedDraggingKey,
  armedKey: meta.armedKey,
  hasDragHandle: meta.hasDragHandle,
  draggingClass: computed(() => props.draggingClass),
  dropZoneClass: computed(() => props.dropZoneClass),
  disabled: computed(() => props.disabled),
  sortable: computed(() => props.sortable),
  itemDraggable: props.itemDraggable,
})
</script>

<style>
/*
 * FormKit-style in-list insert placeholder: faded + green slot so the destination
 * is obvious during sort/transfer. Classes are Vue-driven (no sticky classList).
 */
.kun-dnd-drop-zone {
  opacity: 0.45;
  filter: blur(0.6px);
  background: color-mix(in srgb, #22c55e 22%, transparent) !important;
  outline: 2px solid #22c55e;
  outline-offset: -2px;
  box-shadow: none;
}
.kun-dnd-parent .kun-dnd-item {
  touch-action: none;
  user-select: none;
}
</style>
