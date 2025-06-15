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
          <span>{{ header.label }}</span>
          <span v-if="header.sortable">
            <span v-if="isSorted(header)">
              {{ sortBy.order === 'asc' ? '⬆️' : '⬇️' }}
            </span>
            <span v-else>⇅</span>
          </span>
        </slot>
      </th>
    </tr>
  </thead>
</template>

<script setup>
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
});

const emits = defineEmits(['toggle-select-all', 'sort', 'expandAll', 'collapseAll']);

function toggleSelectAll() {
  emits('toggle-select-all');
}

function toggleSort(header) {
  if (!header.sortable) return;

  const isSame = props.sortBy?.key === header.key;
  const newOrder = isSame && props.sortBy.order === 'asc' ? 'desc' : 'asc';
  emits('sort', { key: header.key, order: newOrder });
}

function isSorted(header) {
  return props.sortBy?.key === header.key;
}

const baseTheadClass = 'bg-slate-800 sticky top-0 z-5';
const mergedTheadClass = [baseTheadClass, props.theadClass];

const baseTrClass = '';
const mergedTrClass = [baseTrClass, props.trClass];

const baseThClass = 'px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider';
const mergedThClass = [baseThClass, props.thClass];
</script>
