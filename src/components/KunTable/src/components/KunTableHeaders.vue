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
      <th v-if="showSelect" :class="mergedThClass" 
      class="h-full w-10 flex flex-col items-center justify-center">
        <input
          ref="checkboxRef"
          type="checkbox"
          :checked="allSelected"
          :aria-checked="someSelected && !allSelected ? 'mixed' : allSelected ? 'true' : 'false'"
          @change="toggleSelectAll"
          class="h-6 w-6 text-blue-600 transition-all duration-200 ease-in-out rounded print:hidden 
          border-gray-300 dark:border-slate-600 
          checked:bg-blue-600 
          checked:border-blue-600 
          indeterminate:bg-blue-400 
          indeterminate:border-blue-400"
        >
      </th>

      <!-- Headers dinámicos -->
      <th
        v-for="header in headers"
        :key="header.key"
        :class="[mergedThClass, header.headerAlign === 'right' ? 'text-right' : header.headerAlign === 'left' ? 'text-left' : 'text-center']"
        @click="toggleSort(header)"
        :style="{ cursor: header.sortable ? 'pointer' : 'default' }"
      >
        <slot :name="`header.${header.key}`" :header="header">
          <span>{{ header.label ?? header.text }}</span>
          <span v-if="header.sortable" class="inline-flex items-center gap-1 ml-1 print:hidden">
            <component :is="getSortIcon(header)" class="w-4 h-4 text-gray-500" />
          </span>
        </slot>
      </th>

      <!-- Headers actions -->
      <th v-if="hasActions" :class="[mergedThClass]" class="text-center print:hidden">
        {{ actionLabel }}
      </th>
    </tr>
  </thead>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import arrowUp from '@/icons/IconArrowUp.vue'
import arrowDown from '@/icons/IconArrowDown.vue'
import arrowDownUp from '@/icons/IconArrowDownUp.vue'

const props = defineProps({
  headers: Array,
  showSelect: Boolean,
  showExpand: Boolean,
  isExpanded: Boolean,
  allSelected: Boolean,
  someSelected: Boolean,
  sortBy: Object,
  theadClass: String,
  trClass: String,
  thClass: String,
  hasActions: Boolean,
  actionLabel: String,
});

const emits = defineEmits(['toggle-select-all', 'sort', 'expandAll', 'collapseAll']);

function toggleSelectAll() {
  emits('toggle-select-all');
}

function toggleSort(header) {
  if (!header.sortable) return;

  let current = null;

  if (Array.isArray(props.sortBy)) {
    current = props.sortBy.find(s => s.key === header.value);
  } else if (typeof props.sortBy === 'string') {
    current = props.sortBy === header.value ? { key: header.value, order: 'asc' } : null;
  }

  const newOrder = current?.order === 'asc' ? 'desc' : 'asc';
  emits('sort', { key: header.value, order: newOrder });
}

function getSortOrder(header) {
  if (Array.isArray(props.sortBy)) {
    return props.sortBy.find(s => s.key === header.value)?.order;
  }
  if (typeof props.sortBy === 'string' && props.sortBy === header.value) {
    return 'asc';
  }
  return undefined;
}

const getSortIcon = (header) => {
  const order = getSortOrder(header);
  if (!order) return arrowDownUp;
  return order === 'asc' ? arrowUp : arrowDown;
}

const baseTheadClass = 'bg-slate-200 dark:bg-slate-800 sticky top-0 z-5';
const mergedTheadClass = [baseTheadClass, props.theadClass];

const baseTrClass = '';
const mergedTrClass = [baseTrClass, props.trClass];

const baseThClass = 'px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider';
const mergedThClass = [baseThClass, props.thClass];

const checkboxRef = ref(null);
const updateIndeterminate = () => {
  if (checkboxRef.value) {
    checkboxRef.value.indeterminate = props.someSelected && !props.allSelected;
  }
};

onMounted(updateIndeterminate);
watch(() => props.someSelected, updateIndeterminate);
watch(() => props.allSelected, updateIndeterminate);

</script>
