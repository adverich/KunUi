<template>
  <tr :class="mergedTableClass" @click="emits('row-click', { item, index, event: $event })">
    <!-- Expand Icon -->
    <td v-if="showExpand" class="print:hidden" :class="mergedTdClass">
      <slot v-if="$slots.expandIcon" name="expand-icon" :item="item" :index="index" />

      <KunBtn v-else @click="emits('toggle-expand', item)" rounded="full" size="xxs" variant="ghost" color="neutral">
        <KunIcon :icon="isExpanded ? '$minus' : '$plus'" :class="isExpanded ? 'text-error' : 'text-success'" />
      </KunBtn>
    </td>

    <!-- Selection Checkbox -->
    <td
      v-if="showSelect"
      :class="mergedTdClass"
      class="h-full w-10 flex flex-col items-center justify-center print:hidden"
    >
      <KunCheckbox
        :model-value="isSelected"
        @update:modelValue="emits('toggle-select', item)"

        :ripple="false"
        :true-value="true"
        :false-value="false"
        :color="isSelected ? 'success' : null"
        hide-details
      />
    </td>

    <!-- Dynamic cells -->
    <td
      v-for="header in headers"
      :key="header.value"
      :class="[
        mergedTdClass,
        header.headerAlign === 'right' ? 'text-right' : header.headerAlign === 'left' ? 'text-left' : 'text-center',
      ]"
    >
      <template v-if="customSlots?.[`item.${header.value}`]">
        <component
          :is="customSlots[`item.${header.value}`]"
          :item="item"
          :value="getValue(header, item)"
          :index="index"
          :header="header"
        />
      </template>
      <template v-else>
        <slot 
          :name="`item.${header.value}`"
          :item="item"
          :value="getValue(header, item)"
          :index="index"
          :header="header"
        >
          {{ formatValue(header, getValue(header, item), item) }}
        </slot>
      </template>
    </td>

    <!-- Action space -->
    <td v-if="hasActions" class="print:hidden" :class="[actionsAlignClass]">
      <slot name="item.actions" :item="item" :index="index" :loading="loading" />
    </td>
  </tr>
</template>

<script setup lang="ts">
/**
 * KunTableRow.vue
 * 
 * Componente de fila individual (<tr>).
 * Responsable de:
 * 1. Renderizar celdas de datos con formateo automático (getValue/formatValue).
 * 2. Renderizar checkboxes y botones de expansión.
 * 3. Renderizar columna de acciones.
 * 4. Gestionar estilos condicionales por fila.
 */
import { computed } from 'vue';
import KunCheckbox from "@/components/KunCheckbox/src/components/KunCheckbox.vue";
import { getValue, formatValue } from '@/utils/tableFormatters.js';
import { kunTableRowProps } from '../composables/kunTableRowProps.js';
import KunBtn from '@/components/KunBtn/src/components/KunBtn.vue';
import KunIcon from '@/components/KunIcon/src/components/KunIcon.vue';
import type { TableItem } from '../composables/useRowKey.js';

const props = defineProps(kunTableRowProps)

const emits = defineEmits(['toggle-expand', 'toggle-select', 'row-click']);

// --- Gestión de Estilos de Celda y Fila ---

const baseTdClass = 'px-1 py-2 whitespace-normal word-break text-sm text-default';
const mergedTdClass = computed(() => props.tdClass || baseTdClass);

// Resuelve clases condicionales dinámicas (ej: filas rojas si stock < 0)
function resolveTdClass(item: TableItem | undefined, index: number | undefined): string {
  const result = typeof props.rowClassCondition === 'function'
    ? (props.rowClassCondition as (args: { item: TableItem | undefined; index: number | undefined }) => unknown)({ item, index })
    : props.rowClassCondition;

  return (result as string)?.trim() || '';
}

const baseRowClass = 'border-t border-muted transition-colors duration-150 hover:bg-elevated/50';
const rowClass = computed(() => props.rowClass || baseRowClass);

const actionsAlignClass = computed(() => {
  const alignMap: Record<string, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }
  return alignMap[props.actionsAlign as string] || 'text-center'
});
// El `<tr>` no pinta background por defecto: hereda el `bg-default` del
// contenedor. Un background estático en la fila pelea en la cascada con
// `selectedClass`/`stripedClass`/`hover:bg-elevated/50` (utilidades del mismo
// nivel; `bg-default` ganaba y anulaba el highlight de selección).
const trClass = computed(() => props.trClass || '');
const conditionalRowClass = computed(() => resolveTdClass(props.item, props.index));

// Clase de fila seleccionada (fallback si el consumidor no define `selectedClass`)
const selectedRowClass = computed(() => props.selectedClass || 'bg-accented text-default');

// Combina todas las clases: base + striped + seleccionada + condicional
// La fila seleccionada no recibe `rowClass` ni `stripedClass` para que su
// background (y no el hover) gane el estado `:hover`; conserva el separador.
const mergedTableClass = computed(() => [
  props.isSelected ? selectedRowClass.value : rowClass.value,
  props.isSelected ? 'border-t border-muted' : '',
  props.isSelected ? '' : props.stripedClass,
  conditionalRowClass.value || trClass.value
]);
</script>

