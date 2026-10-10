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
          :item="(item as any)"
          :index="index"
          :item-key="(resolveKey(item, index) as string)"
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

<script setup lang="ts">
import { computed, provide, ref, watch, type Ref } from 'vue'
import { kunDragAndDropProps } from '../composables/kunDragAndDropProps.js'
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

const parentEl: Ref<HTMLElement | null> = ref(null)

function setParentRef(el: unknown): void {
  parentEl.value = (el as HTMLElement | null) || null
}

const sourceItems = computed((): unknown[] => {
  if (props.modelValue !== undefined) return (props.modelValue as unknown[]) || []
  if (props.items !== undefined) return (props.items as unknown[]) || []
  return []
})

const internalItems: Ref<unknown[]> = ref([...sourceItems.value])

watch(
  sourceItems,
  (next) => {
    internalItems.value = Array.isArray(next) ? [...next] : []
  },
  { deep: true }
)

const dragHandleSelector = computed(() => props.dragHandle || null)

function emitUpdates(list: unknown[]): void {
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
    onDragstart: (payload: Record<string, unknown>) => emit('drag-start', payload),
    onDragend: (payload: Record<string, unknown>) => emit('drag-end', payload),
    onSort: (payload: Record<string, unknown>) => {
      emit('sort', payload)
      emitUpdates(payload.items as unknown[])
    },
    onTransfer: (payload: Record<string, unknown>) => {
      emit('transfer', payload)
      emitUpdates(payload.targetItems as unknown[])
    },
    onValuesChange: (list: unknown[], changeMeta: Record<string, unknown>) => {
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

function resolveKey(item: unknown, index: number): unknown {
  return resolveItemKey(item, props.itemKey as string | ((item: unknown, index: number) => unknown), index)
}

function isItemDragging(item: unknown, index: number): boolean {
  const key = activeDragRef.value?.itemKey
  return key != null && String(key) === String(resolveKey(item, index))
}

function isItemDisabled(item: unknown): boolean {
  if (props.disabled) return true
  if (typeof props.itemDraggable === 'function') return !(props.itemDraggable as (item: unknown) => boolean)(item)
  return false
}

function displayLabel(item: unknown): unknown {
  if (item == null) return ''
  if (typeof item === 'string' || typeof item === 'number') return String(item)
  const rec = item as Record<string, unknown>;
  return rec.title ?? rec.name ?? rec.label ?? resolveKey(item, 0)
}

const sharedDraggingKey = computed(() => activeDragRef.value?.itemKey ?? null)

provide(KUN_DRAG_AND_DROP_KEY, {
  resolveKey: (item: unknown, index: number) => resolveKey(item, index),
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

