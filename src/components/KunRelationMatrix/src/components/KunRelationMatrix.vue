<script setup>
import { computed, toRaw, watchEffect } from 'vue'
import { getNestedValue } from '@/utils/tableFormatters'
import KunVirtualScroller from '@/components/KunVirtualScroller/src/components/KunVirtualScroller.vue'
import KunCheckbox from '@/components/KunCheckbox/src/components/KunCheckbox.vue'

const props = defineProps({
  rows: Array,
  columns: Array,
  relationTitle: { type: String, default: 'Registros' },
  rowKey: { type: String, default: 'id' },
  columnKey: { type: String, default: 'id' },
  rowLabel: { type: String, default: 'name' },
  columnLabel: { type: String, default: 'name' },
  relationPath: String,
  relationKey: { type: String, default: 'id' },
  modelValue: {
    type: Object,
    default: () => ({})
  },
  cellClass: {
    type: String,
    default: ''
  },
  border: { type: String, default: 'border border-slate-200 dark:border-slate-800' },
  rounded: { type: String, default: 'rounded' },
  relationDirection: { type: String, default: 'row' }, // 'row' o 'column'
})

const emit = defineEmits(['update:modelValue'])

const rowKey = computed(() => props.rowKey)
const columnKey = computed(() => props.columnKey)
const rowLabel = computed(() => props.rowLabel)
const columnLabel = computed(() => props.columnLabel)

const useColumnAsBase = computed(() => props.relationDirection === 'column')

// Construye el modelo interno automáticamente si modelValue está vacío
const internalModel = computed(() => {
  if (Object.keys(props.modelValue).length) return props.modelValue

  const baseItems = useColumnAsBase.value ? props.columns : props.rows
  const key = useColumnAsBase.value ? props.columnKey : props.rowKey

  const result = {}
  for (const item of baseItems) {
    const id = getNestedValue(item, key)
    const related = getNestedValue(item, props.relationPath)
    if (!Array.isArray(related)) continue

    result[id] = related
      .map(r => getNestedValue(r, props.relationKey))
      .filter(val => val !== undefined && val !== null)
  }

  return result
})

// Se usa tanto para mostrar como para comparar los datos
function isChecked(row, col) {
  const rowId = getNestedValue(row, rowKey.value)
  const colId = getNestedValue(col, columnKey.value)

  if (useColumnAsBase.value) {
    return internalModel.value?.[colId]?.includes(rowId) || false
  } else {
    return internalModel.value?.[rowId]?.includes(colId) || false
  }
}

// Modifica el modelo de relación actual
function toggle(row, col, checked) {
  const rowId = getNestedValue(row, rowKey.value)
  const colId = getNestedValue(col, columnKey.value)

  const baseId = useColumnAsBase.value ? colId : rowId
  const relId = useColumnAsBase.value ? rowId : colId

  const clone = structuredClone(internalModel.value)

  if (!Array.isArray(clone[baseId])) clone[baseId] = []

  if (checked) {
    if (!clone[baseId].includes(relId)) clone[baseId].push(relId)
  } else {
    clone[baseId] = clone[baseId].filter(id => id !== relId)
  }

  emit('update:modelValue', clone)
}

// Debug interno
watchEffect(() => {
  console.log('[KunRelationMatrix] internalModel:', toRaw(internalModel.value))
})
</script>

<template>
  <div class="overflow-auto" :class="[border, rounded]">
    <!-- Header -->
    <div class="sticky top-0 z-10 flex border-b text-sm font-semibold bg-white">
      <div class="p-2 border-r w-[16rem] shrink-0">
        <slot name="row-header">{{ relationTitle }}</slot>
      </div>
      <div
        v-for="col in columns"
        :key="col[columnKey]"
        class="p-2 border-r text-center w-[8rem] shrink-0"
      >
        <slot name="column-header" :column="col">
          {{ getNestedValue(col, columnLabel) }}
        </slot>
      </div>
    </div>

    <!-- Rows virtualizadas -->
    <KunVirtualScroller :items="rows" :estimatedItemHeight="48">
      <template #default="{ item: row }">
        <div class="flex border-b text-sm">
          <div class="p-2 border-r w-[16rem] shrink-0">
            <slot name="row-label" :row="row">
              {{ getNestedValue(row, rowLabel) }}
            </slot>
          </div>
          <div
            v-for="col in columns"
            :key="col[columnKey]"
            :class="['p-2 border-r text-center w-[8rem] shrink-0', cellClass]"
          >
            <slot
              name="cell"
              :row="row"
              :column="col"
              :checked="isChecked(row, col)"
              :toggle="checked => toggle(row, col, checked)"
            >
              <KunCheckbox
                :modelValue="isChecked(row, col)"
                @update:modelValue="checked => toggle(row, col, checked)"
              />
            </slot>
          </div>
        </div>
      </template>
    </KunVirtualScroller>
  </div>
</template>
