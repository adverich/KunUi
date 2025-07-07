<template>
  <tr :class="mergedTableClass" @click="emits('row-click', { item, index, event: $event })">
    <!-- Expand Icon -->
    <td v-if="showExpand" :class="mergedTdClass">
      <slot v-if="$slots.expandIcon" name="expand-icon" :item="item" :index="index" />
      <button v-else @click="emits('toggle-expand', item)">
        <span v-if="isExpanded">−</span>
        <span v-else>+</span>
      </button>
    </td>

    <!-- Selection Checkbox -->
    <td
      v-if="showSelect"
      :class="mergedTdClass"
      class="h-full w-10 flex flex-col items-center justify-center"
    >
      <input
        type="checkbox"
        :checked="isSelected"
        @change.stop="emits('toggle-select', item)"
        class="h-5 w-5 text-blue-600 transition-all duration-200 ease-in-out rounded"
      />
    </td>

    <!-- Dynamic cells -->
    <td
      v-for="header in headers"
      :key="header.value"
      :class="[mergedTdClass, header.align === 'right' ? 'text-right' : header.align === 'left' ? 'text-left' : 'text-center']"
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
          {{ formatValue(header, getValue(header, item)) }}
        </slot>
      </template>
    </td>

    <!-- Action space -->
    <td v-if="hasActions" :class="[mergedTdClass, mergedActionsClass]">
      <slot name="item.actions" :item="item" :index="index" :loading="loading" />
    </td>
  </tr>
</template>

<script setup>
import { computed } from 'vue';
import { getValue, formatValue } from '@/utils/tableFormatters';
const props = defineProps({
  item: Object,
  index: Number,
  headers: Array,
  showExpand: Boolean,
  showSelect: Boolean,
  isExpanded: Boolean,
  rowClass: String, 
  trClass: String,
  tdClass: String,
  selectedClass: String,
  stripedClass: String,
  isSelected: Boolean,
  hasActions: Boolean,
  actionsAlign: String,
  loading: Boolean,
  customSlots: Object,
});

const emits = defineEmits(['toggle-expand', 'toggle-select', 'row-click']);

const baseRowClass = 'hover:bg-slate-300 dark:hover:bg-slate-600 border-t border-slate-300 dark:border-slate-700';
const baseTrClass = 'bg-slate-100 dark:bg-slate-900';
const mergedTableClass = computed(() => [
  baseRowClass, baseTrClass, props.rowClass, props.trClass, props.stripedClass, props.isSelected ? props.selectedClass : ''
]);

const baseTdClass = 'px-3 py-2 whitespace-nowrap text-sm text-black dark:text-white';
const mergedTdClass = computed(() => [baseTdClass, props.tdClass]);
const mergedActionsClass = computed(() => ['text-center', props.actionsAlign]);
</script>
