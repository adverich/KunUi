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
    >
      <input
        type="checkbox"
        :checked="isSelected"
        @change.stop="emits('toggle-select', item)"
        class="form-checkbox"
      />
    </td>

    <!-- Dynamic cells -->
    <td
      v-for="header in headers"
      :key="header.value"
      :class="[mergedTdClass, header.align === 'right' ? 'text-right' : header.align === 'center' ? 'text-center' : 'text-left']"
    >
      <slot :name="`item.${header.value}`" :item="item" :value="item[header.value]" :index="index">
        {{ item[header.value] }}
      </slot>
    </td>

    <!-- Action space -->
    <td v-if="hasActions" :class="[mergedTdClass, mergedActionsClass]">
      <slot name="item.actions" :item="item" :index="index" :loading="loading" />
    </td>
  </tr>
</template>

<script setup>
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
});

const emits = defineEmits(['toggle-expand', 'toggle-select', 'row-click']);

const baseRowClass = 'hover:bg-slate-300 dark:hover:bg-slate-600';
const baseTrClass = '';
const mergedTableClass = [
  baseRowClass, baseTrClass, props.rowClass, props.trClass, props.stripedClass, props.isSelected ? props.selectedClass : ''
];

const baseTdClass = 'px-3 py-2 whitespace-nowrap text-sm text-black dark:text-white ';
const mergedTdClass = [baseTdClass, props.tdClass];
const mergedActionsClass = ['text-center', props.actionsAlign]
</script>
