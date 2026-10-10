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
          :key="(col[columnKey as string] as string)"
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
            class="grid items-center hover:bg-ui-hover"
            :style="`grid-template-columns: repeat(${columns.length + 1}, minmax(120px, 1fr))`"
          >
            <div class="px-2 py-1 border-b font-medium text-lg">
              {{ getNestedValue(row as MatrixRow, rowLabel) }}
            </div>
            <div
              v-for="col in columns"
              :key="(col[columnKey as string] as string)"
              class="flex justify-center items-center px-2 py-1 border-b h-full"
            >
              <KunCheckbox
                :modelValue="hasRelation(row as MatrixRow, col)"
                :color="hasRelation(row as MatrixRow, col) ? 'text-success' : ''"
                @update:modelValue="checked => onCheckboxChange(row as MatrixRow, col, checked as boolean)"
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

<script setup lang="ts">
import KunCheckbox from '@/components/KunCheckbox/src/components/KunCheckbox.vue'
import { getNestedValue } from '@/utils/tableFormatters.js'
import KunVirtualScroller from '@/components/KunVirtualScroller/src/components/KunVirtualScroller.vue'
import { kunRelationMatrixProps, type MatrixRow } from '../composables/kunRelationMatrixProps.js'

const props = defineProps(kunRelationMatrixProps)

function getSource(row: MatrixRow, col: MatrixRow): MatrixRow {
  return props.relationDirection === 'column' ? col : row
}

function getTarget(row: MatrixRow, col: MatrixRow): MatrixRow {
  return props.relationDirection === 'column' ? row : col
}

function getTargetKey(): string {
  return (props.relationDirection === 'column' ? props.rowKey : props.columnKey) as string
}

function getTargetId(row: MatrixRow, col: MatrixRow): unknown {
  return getNestedValue(getTarget(row, col), getTargetKey())
}

function getRelationTargetId(relation: unknown): unknown {
  return getNestedValue(relation as MatrixRow, getTargetKey())
}

function hasRelation(row: MatrixRow, col: MatrixRow): boolean {
  const source = getSource(row, col)
  const targetId = getTargetId(row, col)
  const related = (props.getRelatedEntities as unknown as ((row: MatrixRow, col: MatrixRow) => unknown) | undefined)?.(row, col) ?? getNestedValue(source, props.relationKey as string)
  const list = Array.isArray(related) ? related : []
  return list.some((relation: unknown) => getRelationTargetId(relation) === targetId)
}

function onCheckboxChange(row: MatrixRow, col: MatrixRow, checked: boolean): void {
  const source = getSource(row, col)
  const target = getTarget(row, col)
  const targetId = getTargetId(row, col)

  let related = getNestedValue(source, props.relationKey as string) as unknown[]

  if (!Array.isArray(related)) {
    related = []
    const keys = (props.relationKey as string).split('.')
    let base = source as Record<string, unknown>
    for (let i = 0; i < keys.length - 1; i++) {
      base[keys[i]] ??= {}
      base = base[keys[i]] as Record<string, unknown>
    }
    base[keys[keys.length - 1]] = related
  }

  if (checked) {
    const alreadyExists = related.some((relation: unknown) => getRelationTargetId(relation) === targetId)
    if (!alreadyExists) {
      if (props.returnObject) {
        related.push(target)
      } else {
        related.push({ [getTargetKey()]: targetId })
      }
    }
  } else {
    const index = related.findIndex((relation: unknown) => getRelationTargetId(relation) === targetId)
    if (index !== -1) related.splice(index, 1)
  }

  ;(props.onToggleRelation as unknown as ((payload: Record<string, unknown>) => void) | undefined)?.({
    row,
    column: col,
    hasRelation: checked,
    existingRelationData: related.find((relation: unknown) => getRelationTargetId(relation) === targetId)
  })
}
</script>

