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
      <th v-if="showSelect" :class="mergedThClass">
        <input
          type="checkbox"
          :checked="allSelected"
          @change="toggleSelectAll"
          class="form-checkbox"
        />
      </th>

      <!-- Headers dinámicos -->
      <th
        v-for="header in headers"
        :key="header.key"
        :class="[mergedThClass, header.headerAlign === 'right' ? 'text-right' : header.headerAlign === 'center' ? 'text-center' : 'text-left']"
        @click="toggleSort(header)"
        :style="{ cursor: header.sortable ? 'pointer' : 'default' }"
      >
        <slot :name="`header.${header.key}`" :header="header">
          <span>{{ header.label ?? header.text }}</span>
          <span v-if="header.sortable" class="inline-flex items-center gap-1 ml-1">
            <component :is="getSortIcon(header)" class="w-4 h-4 text-gray-500" />
          </span>
        </slot>
      </th>

      <!-- Headers actions -->
      <th v-if="hasActions" :class="[mergedThClass]" class="text-center">
        {{ actionLabel }}
      </th>
    </tr>
  </thead>
</template>

<script setup>
import arrowUp from '@/icons/IconArrowUp.vue'
import arrowDown from '@/icons/IconArrowDown.vue'
import arrowDownUp from '@/icons/IconArrowDownUp.vue'

const props = defineProps({
  headers: Array,
  showSelect: Boolean,
  showExpand: Boolean,
  isExpanded: Boolean,
  allSelected: Boolean,
  sortBy: Object, // { key, order }
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

  const existing = props.sortBy?.find(s => s.key === header.value);
  const newOrder = existing?.order === 'asc' ? 'desc' : 'asc';

  emits('sort', { key: header.value, order: newOrder });
}

function getSortOrder(header) {
  return props.sortBy?.find(s => s.key === header.value)?.order;
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
</script>
