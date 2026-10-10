<template>
  <thead :class="mergedTheadClass">
    <tr :class="mergedTrClass">
      <!-- Expand slot icon -->
      <th v-if="showExpand" :class="[mergedThClass]">
        <slot v-if="$slots.expandIcon" name="expand-icon" />
        <button v-else @click="isExpanded ? emits('expandAll') : emits('collapseAll')">
          <span v-if="isExpanded">−</span>
          <span v-else>+</span>
        </button>
      </th>

      <!-- Checkbox de selección -->
      <th v-if="showSelect" :class="mergedThClass" class="h-full w-10 flex flex-col items-center justify-center print:hidden">
        <KunCheckbox
          :model-value="allSelected"
          @update:modelValue="toggleSelectAll"
          :indeterminate="someSelected"
          :ripple="false"
          :true-value="true"
          :false-value="false"
          :color="someSelected && !allSelected && !moreThanPaginated ? 'text-warning' : allSelected || moreThanPaginated ? 'text-success' : ''"
          hide-details
        />
      </th>

      <!-- Headers dinámicos -->
      <th
        v-for="header in headers"
        :key="header.key"
        :class="[
          mergedThClass,
          header.headerAlign === 'right' ? 'text-right' : header.headerAlign === 'left' ? 'text-left' : 'text-center',
          disabled && header.sortable ? 'opacity-60' : '',
        ]"
        @click="toggleSort(header)"
        :style="{ cursor: header.sortable && !disabled ? 'pointer' : 'default' }"
      >
        <template v-if="customHeaders?.[`header.${header.value}`]">
          <component
            :is="customHeaders[`header.${header.value}`]"
            :header="header"
          />
        </template>

        <template v-else>
          <slot :name="`header.${header.key}`" :header="header">
            <span>{{ header.label ?? header.text }}</span>
            <span v-if="header.sortable" class="inline-flex items-center gap-1 ml-1 print:hidden">
              <component :is="getSortIcon(header)" class="w-4 h-4 text-ui-muted" />
            </span>
          </slot>
        </template>
      </th>

      <!-- Headers actions -->
      <th v-if="hasActions" :class="[mergedThClass]" class="text-center print:hidden">
        {{ actionLabel }}
      </th>
    </tr>
  </thead>
</template>

<script setup lang="ts">
/**
 * KunTableHeaders.vue
 * 
 * Renderiza la fila de encabezados de la tabla (<thead>).
 * Maneja interacciones como:
 * - Ordenamiento al hacer clic en columnas
 * - Selección de "todas las filas"
 * - Expansión/Colapso global (si aplica)
 */
import { ref, watch, onMounted, type Ref } from 'vue';
import arrowUp from '@/icons/IconArrowUp.vue'
import arrowDown from '@/icons/IconArrowDown.vue'
import arrowDownUp from '@/icons/IconArrowDownUp.vue'
import KunCheckbox from "@/components/KunCheckbox/src/components/KunCheckbox.vue"
import { kunTableHeadersProps } from '../composables/kunTableHeadersProps.js'
import type { KunTableHeader } from '@/utils/tableFormatters.js'

const props = defineProps(kunTableHeadersProps)

const emits = defineEmits(['toggle-select-all', 'sort', 'expandAll', 'collapseAll']);

// Maneja clic en checkbox maestro
function toggleSelectAll() {
  emits('toggle-select-all');
}

// Maneja lógica de cambio de orden (asc -> desc -> asc)
function toggleSort(header: KunTableHeader): void {
  if (props.disabled || !header.sortable) return;

  let current: { key: string; order: string } | null | undefined = null;

  if (Array.isArray(props.sortBy)) {
    current = (props.sortBy as { key: string; order: string }[]).find((s: { key: string; order: string }) => s.key === header.value);
  } else if (typeof props.sortBy === 'string') {
    current = props.sortBy === header.value ? { key: header.value as string, order: 'asc' } : null;
  }

  // Alternar orden: si es asc pasa a desc, sino a asc
  const newOrder = current?.order === 'asc' ? 'desc' : 'asc';
  emits('sort', { key: header.value, order: newOrder });
}

// Helper para saber el orden actual de una columna
function getSortOrder(header: KunTableHeader): string | undefined {
  if (Array.isArray(props.sortBy)) {
    return (props.sortBy as { key: string; order: string }[]).find((s: { key: string; order: string }) => s.key === header.value)?.order;
  }
  if (typeof props.sortBy === 'string' && props.sortBy === header.value) {
    return 'asc';
  }
  return undefined;
}

// Retorna el ícono correcto según estado de orden
const getSortIcon = (header: KunTableHeader) => {
  const order = getSortOrder(header);
  if (!order) return arrowDownUp;
  return order === 'asc' ? arrowUp : arrowDown;
}

// --- Clases Base ---
const baseTheadClass = 'bg-surface sticky top-0 z-5';
const mergedTheadClass = [baseTheadClass, props.theadClass];

const baseTrClass = '';
const mergedTrClass = [baseTrClass, props.trClass];

const baseThClass = 'px-3 py-2 text-xs font-medium text-ui-muted uppercase tracking-wider';
const mergedThClass = [baseThClass, props.thClass];

// --- Control de Checkbox Indeterminado ---
const checkboxRef: Ref<HTMLInputElement | null> = ref(null);
const updateIndeterminate = () => {
  if (checkboxRef.value) {
    // Ajusta la propiedad visual 'indeterminate' del input nativo si es necesario
    checkboxRef.value.indeterminate = props.someSelected && !props.allSelected && props.moreThanPaginated;
  }
};

onMounted(updateIndeterminate);
watch(() => props.someSelected, updateIndeterminate);
watch(() => props.allSelected, updateIndeterminate);

</script>

