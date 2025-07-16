<script setup>
import { computed, toRaw, watchEffect  } from 'vue'
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

const internalModel = computed(() => {
  if (Object.keys(props.modelValue).length) return props.modelValue

  const source = props.relationDirection === 'column' ? props.columns : props.rows
  const key = props.relationDirection === 'column' ? props.columnKey : props.rowKey

  const result = {}
  for (const item of source) {
    const id = getNestedValue(item, key)
    const related = getNestedValue(item, props.relationPath)
    if (!Array.isArray(related)) continue

    result[id] = related
      .map(r => getNestedValue(r, props.relationKey))
      .filter(Boolean)
  }

  return result
})

watchEffect(() => {
  console.log('internalModel:', JSON.stringify(toRaw(internalModel.value), null, 2))
})

function toggle(rowId, colId, checked) {
  const clone = structuredClone(props.modelValue && Object.keys(props.modelValue).length
    ? props.modelValue
    : internalModel.value
  )

  if (!Array.isArray(clone[rowId])) clone[rowId] = []

  if (checked) {
    if (!clone[rowId].includes(colId)) clone[rowId].push(colId)
  } else {
    clone[rowId] = clone[rowId].filter(id => id !== colId)
  }

  emit('update:modelValue', clone)
}

function relationIncludes(row, col) {
  const rowId = getNestedValue(row, rowKey.value)
  const colId = getNestedValue(col, columnKey.value)

  if (props.relationDirection === 'column') {
    const related = getNestedValue(col, props.relationPath)
    if (!Array.isArray(related)) return false
    return related.some(rel => getNestedValue(rel, props.relationKey) === rowId)
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
              :checked="relationIncludes(row, col)"
              :toggle="checked => toggle(getNestedValue(row, rowKey), getNestedValue(col, columnKey), checked)"
            >
              <KunCheckbox
                :modelValue="relationIncludes(row, col)"
                @update:modelValue="checked =>
                  toggle(getNestedValue(row, rowKey), getNestedValue(col, columnKey), checked)"
              />
            </slot>
          </div>
        </div>
      </template>
    </KunVirtualScroller>
    <pre class="text-xs p-2">{{ internalModel }}</pre>
  </div>
</template>
