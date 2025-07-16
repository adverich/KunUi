<template>
  <div class="overflow-auto w-full">
    <table class="min-w-full text-sm">
      <thead>
        <tr>
          <th class="border px-2 py-1"> {{ relationTitle }} </th>
          <th v-for="col in columns"
            :key="col[columnKey]"
            class="border px-2 py-1 font-medium text-center"
          >
            <slot name="column-header" :column="col">
              {{ getNestedValue(col, columnLabel) }}
            </slot>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row[rowKey]">
          <th class="border px-2 py-1 font-medium text-left">
            <slot name="row-header" :row="row">
              {{ getNestedValue(row, rowLabel) }}
            </slot>
          </th>
          <td
            v-for="col in columns"
            :key="col[columnKey]"
            class="align-center justify-center border"
          >
            <div class="w-full flex justify-center">
              <KunCheckbox
                :modelValue="hasRelation(row, col)"
                @update:modelValue="checked => onCheckboxChange(row, col, checked)"
                size="sm"
                :label="''"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import KunCheckbox from '@/components/KunCheckbox/src/components/KunCheckbox.vue'
import { getNestedValue } from '@/utils/tableFormatters.js'

const props = defineProps({
  relationTitle: { type: String, default: 'Relaciones' },
  rows: Array,
  columns: Array,
  rowKey: { type: String, default: 'id' },
  columnKey: { type: String, default: 'id' },
  relationKey: { type: String, default: 'users' },
  rowLabel: String,
  columnLabel: String,
  relationDirection: {
    type: String,
    default: 'column',
    validator: v => ['column', 'row'].includes(v)
  },
  getRelatedEntities: Function,
  onToggleRelation: Function,
})

function getSource(row, col) {
  return props.relationDirection === 'column' ? col : row
}

function getTarget(row, col) {
  return props.relationDirection === 'column' ? row : col
}

function getTargetId(row, col) {
  return props.relationDirection === 'column'
    ? row?.[props.rowKey]
    : col?.[props.columnKey]
}

function hasRelation(row, col) {
  const source = getSource(row, col)
  const targetId = getTargetId(row, col)
  const related = props.getRelatedEntities?.(row, col) ?? getNestedValue(source, props.relationKey)
  const list = Array.isArray(related) ? related : []

  const result = list.some(r => r?.id === targetId)

  return result
}

function onCheckboxChange(row, col, checked) {
  const source = getSource(row, col)
  const target = getTarget(row, col)
  const targetId = getTargetId(row, col)

  let related = getNestedValue(source, props.relationKey)

  if (!Array.isArray(related)) {
    related = []
    const keys = props.relationKey.split('.')
    let base = source
    for (let i = 0; i < keys.length - 1; i++) {
      base[keys[i]] ??= {}
      base = base[keys[i]]
    }
    base[keys[keys.length - 1]] = related
  }

  if (checked) {
    related.push({ id: target.id, email: target.email })
  } else {
    const index = related.findIndex(r => r.id === targetId)
    if (index !== -1) related.splice(index, 1)
  }

  props.onToggleRelation?.({
    row,
    column: col,
    hasRelation: checked,
    existingRelationData: related.find(r => r?.id === targetId)
  })
}
</script>
