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
        <KunCheckbox
          :model-value="allSelected"
          @update:modelValue="toggleSelectAll"
          :indeterminate="someSelected"
          :ripple="false"
          :true-value="true"
          :false-value="false"
          :color="someSelected && !allSelected ? 'text-yellow-600 dark:text-yellow-400' : allSelected ? 'text-green-600 dark:text-green-400' : ''"
          hide-details
        />
      </th>

      <!-- Headers dinámicos -->
      <th
        v-for="header in headers"
        :key="header.key"
        :class="[mergedThClass, header.headerAlign === 'right' ? 'text-right' : header.headerAlign === 'left' ? 'text-left' : 'text-center']"
        @click="toggleSort(header)"
        :style="{ cursor: header.sortable ? 'pointer' : 'default' }"
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
              <component :is="getSortIcon(header)" class="w-4 h-4 text-gray-500" />
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

<script setup>
import { ref, watch, onMounted } from 'vue';
import arrowUp from '@/icons/IconArrowUp.vue'
import arrowDown from '@/icons/IconArrowDown.vue'
import arrowDownUp from '@/icons/IconArrowDownUp.vue'
import KunCheckbox from "@/components/KunCheckbox/src/components/KunCheckbox.vue"

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
  customHeaders: Object,
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
