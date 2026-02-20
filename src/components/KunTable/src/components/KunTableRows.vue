<template>
  <tbody :class="mergedTbodyClass">
    <template v-for="(item, index) in items" :key="itemKey(item, index)">
      <KunTableRow
        :item="item"
        :index="index"
        :headers="headers"
        :showExpand="showExpand"
        :showSelect="showSelect"
        :is-selected="isSelected(item)"
        :is-expanded="isExpanded(item)"
        :has-actions="hasActions"
        :loading="actionLoadingMap[item.id] || false"
        @toggle-expand="emits('toggle-expand', item)"
        @toggle-select="emits('toggle-select', item)"
        @row-click="emits('row-click', $event)"
        v-bind="$attrs"
        :customSlots="customSlots"
      >
        <template
          v-for="(_, name) in $slots"
          #[name]="slotProps"
        >
          <!-- <slot name="item.actions" :item="item" :index="index" :loading="loading" /> -->
          <slot :name="name" v-bind="{ ...slotProps, item, index, loading: actionLoadingMap?.[item.id] || false }" />
        </template>
      </KunTableRow>

      <!-- Fila expandida -->
      <tr v-if="isExpanded(item)">
        <td :colspan="fullColspan">
          <slot name="expand" :item="item" :index="index">
            <div class="text-center opacity-70 text-sm">No hay contenido expandido.</div>
          </slot>
        </td>
      </tr>
    </template>
  </tbody>
</template>

<script setup>
/**
 * KunTableRows.vue
 * 
 * Contenedor del cuerpo de la tabla (<tbody>).
 * Itera sobre la lista de items paginados y renderiza:
 * 1. La fila principal (KunTableRow)
 * 2. La fila de expansión (si está activa)
 */
import { computed } from 'vue';
import KunTableRow from './KunTableRow.vue';
import { kunTableRowsProps } from '../composables/kunTableRowsProps'

const props = defineProps(kunTableRowsProps)

const emits = defineEmits(['toggle-expand', 'toggle-select', 'row-click']);

const baseTbodyClass = 'table-auto h-full w-full text-sm text-left';
const mergedTbodyClass = [baseTbodyClass, props.tbodyClass];

// Calcula dinámicamente el colspan para la fila expandida
// Data columns + Select column + Expand column + Actions column
const fullColspan = computed(() => {
  let total = props.headers?.length || 0;
  if (props.showSelect) total += 1;
  if (props.showExpand) total += 1;
  if (props.hasActions) total += 1;
  return total;
});
</script>
