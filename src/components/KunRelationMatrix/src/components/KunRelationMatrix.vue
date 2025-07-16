<script setup>
import { computed } from 'vue'
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
  relationPath: String, // ej: 'entity.entity_employee.invoice_types'
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
  relationDirection: { type: String, default: 'row' },
})

const emit = defineEmits(['update:modelValue'])

const rowKey = computed(() => props.rowKey)
const columnKey = computed(() => props.columnKey)
const rowLabel = computed(() => props.rowLabel)
const columnLabel = computed(() => props.columnLabel)

const internalModel = computed(() => {
  if (Object.keys(props.modelValue).length) return props.modelValue

  const source = props.relationDirection === 'column' ? props.columns : props.rows
  const key = props.relationDirection === 'column' ? props.columnKey : props.rowKey

  const result = {}
  for (const item of source) {
    const id = getNestedValue(item, key)
    const related = getNestedValue(item, props.relationPath)
    if (!Array.isArray(related)) continue

    result[id] = related.map(r => getNestedValue(r, props.relationKey)).filter(Boolean)
  }

  return result
})

function toggle(rowId, colId, checked) {
  const clone = structuredClone(internalModel.value)
  if (!Array.isArray(clone[rowId])) clone[rowId] = []

  if (checked) {
    if (!clone[rowId].includes(colId)) clone[rowId].push(colId)
  } else {
    clone[rowId] = clone[rowId].filter(id => id !== colId)
  }

  emit('update:modelValue', clone)
}

function relationIncludes(row, colId) {
  if (props.relationDirection === 'column') {
    const related = getNestedValue(colId, props.relationPath)
    if (!Array.isArray(related)) return false
    return related.some(rel => getNestedValue(rel, props.relationKey) === row[rowKey.value])
  }

  const related = getNestedValue(row, props.relationPath)
  if (!Array.isArray(related)) return false
  return related.some(rel => getNestedValue(rel, props.relationKey) === colId)
}
</script>

<template>
  <div class="overflow-auto" :class="[border, rounded]">
    <!-- Header -->
    <div class="sticky top-0 z-10 flex border-b text-sm font-semibold">
      <div class="p-2 border-r min-w-[12rem]">
        <slot name="row-header">{{ relationTitle }}</slot>
      </div>
      <div
        v-for="col in columns"
        :key="col[columnKey]"
        class="p-2 border-r text-center min-w-[6rem]"
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
          <div class="p-2 border-r flex-1">
            <slot name="row-label" :row="row">
              {{ getNestedValue(row, rowLabel) }}
            </slot>
          </div>
          <div
            v-for="col in columns"
            :key="col[columnKey]"
            :class="['p-2 border-r text-center min-w-[12rem]', cellClass]"
          >
            <slot
              name="cell"
              :row="row"
              :column="col"
              :checked="relationIncludes(row, col[columnKey])"
              :toggle="checked => toggle(row[rowKey], col[columnKey], checked)"
            >
              <KunCheckbox
                :modelValue="relationIncludes(row, col[columnKey])"
                @update:modelValue="checked => toggle(row[rowKey], col[columnKey], checked)"
              />
            </slot>
          </div>
        </div>
      </template>
    </KunVirtualScroller>
  </div>
</template>
