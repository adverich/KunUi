<template>
  <tr :class="mergedTableClass" @click="emits('row-click', { item, index, event: $event })">
    <!-- Expand Icon -->
    <td v-if="showExpand" class="print:hidden" :class="mergedTdClass">
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
      class="h-full w-10 flex flex-col items-center justify-center print:hidden"
    >
      <KunCheckbox
        :model-value="isSelected"
        @update:modelValue="emits('toggle-select', item)"

        :ripple="false"
        :true-value="true"
        :false-value="false"
        :color="isSelected ? 'text-green-600 dark:text-green-400' : ''"
        hide-details
      />
    </td>

    <!-- Dynamic cells -->
    <td
      v-for="header in headers"
      :key="header.value"
      :class="[
        mergedTdClass,
        header.align === 'right' ? 'text-right' : header.align === 'left' ? 'text-left' : 'text-center',
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
          {{ formatValue(header, getValue(header, item)) }}
        </slot>
      </template>
    </td>

    <!-- Action space -->
    <td v-if="hasActions" class="print:hidden" :class="['text-center', props.actionsAlign]">
      <slot name="item.actions" :item="item" :index="index" :loading="loading" />
    </td>
  </tr>
</template>

<script setup>
import { computed } from 'vue';
import KunCheckbox from "@/components/KunCheckbox/src/components/KunCheckbox.vue"
import { getValue, formatValue } from '@/utils/tableFormatters';
const props = defineProps({
  item: Object,
  index: Number,
  headers: Array,
  showExpand: Boolean,
  showSelect: Boolean,
  isExpanded: Boolean,
  isSelected: Boolean,
  rowClass: String,
  trClass: String,
  tdClass: String,
  selectedClass: String,
  stripedClass: String,
  hasActions: Boolean,
  actionsAlign: String,
  loading: { type: [Boolean, Object], default: false },
  rowClassCondition: [String, Function],
  customSlots: Object,
});

const emits = defineEmits(['toggle-expand', 'toggle-select', 'row-click']);

const baseTdClass = 'px-1 py-2 whitespace-normal word-break text-sm text-black dark:text-white';
const mergedTdClass = computed(() => props.tdClass || baseTdClass);

function resolveTdClass(item, index) {
  const result = typeof props.rowClassCondition === 'function'
    ? props.rowClassCondition({ item, index })
    : props.rowClassCondition;

  return result?.trim() || '';
}

const baseRowClass = 'hover:bg-select-hover border-t border-slate-300 dark:border-slate-700';
const rowClass = computed(() => props.rowClass || baseRowClass);
const baseTrClass = 'bg-surface';
const trClass = computed(() => props.trClass || baseTrClass);
const conditionalRowClass = computed(() => resolveTdClass(props.item, props.index));

const mergedTableClass = computed(() => [
  rowClass.value,
  props.stripedClass,
  props.isSelected ? props.selectedClass : '',
  conditionalRowClass.value || trClass.value
]);
</script>
