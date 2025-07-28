<template>
  <div class="w-full h-full overflow-hidden">
    <div class="w-full h-full">
      <!-- Encabezado de columnas -->
      <div
        class="grid sticky top-0 z-10"
        :style="`grid-template-columns: repeat(${columns.length + 1}, minmax(120px, 1fr))`"
      >
        <div class="px-2 py-1 font-bold border-b">{{ relationTitle }}</div>
        <div
          v-for="col in columns"
          :key="col[columnKey]"
          class="px-2 py-1 font-bold text-center border-b"
        >
          {{ getNestedValue(col, columnLabel) }}
        </div>
      </div>

      <div class="h-full pb-9">
      <!-- Cuerpo virtualizado -->
      <KunVirtualScroller :items="rows" :estimatedItemHeight="36" class="w-full">
        <template #default="{ item: row }">
          <div
            class="grid items-center hover:bg-slate-200 dark:hover:bg-slate-800"
            :style="`grid-template-columns: repeat(${columns.length + 1}, minmax(120px, 1fr))`"
          >
            <div class="px-2 py-1 border-b font-medium text-lg">
              {{ getNestedValue(row, rowLabel) }}
            </div>
            <div
              v-for="col in columns"
              :key="col[columnKey]"
              class="flex justify-center items-center px-2 py-1 border-b h-full"
            >
              <KunCheckbox
                :modelValue="hasRelation(row, col)"
                :color="hasRelation(row, col) ? 'text-green-600 dark:text-green-400' : ''"
                @update:modelValue="checked => onCheckboxChange(row, col, checked)"
                size="lg"
                :label="''"
              />
            </div>
          </div>
        </template>
      </KunVirtualScroller>
      </div>
    </div>
  </div>
</template>

<script setup>
import KunCheckbox from '@/components/KunCheckbox/src/components/KunCheckbox.vue'
import { getNestedValue } from '@/utils/tableFormatters.js'
import KunVirtualScroller from '@/components/KunVirtualScroller/src/components/KunVirtualScroller.vue'

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
    validator: v => ['column', 'row'].includes(v),
  },
  getRelatedEntities: Function,
  onToggleRelation: Function
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
  return list.some(r => r?.id === targetId)
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
