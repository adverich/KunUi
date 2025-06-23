<template>
  <div
    :class="mergedContainerClass"
    @click="emits('row-click', { item, index, event: $event })"
  >
    <!-- Cabecera de controles -->
    <div class="flex items-center justify-between gap-2 mb-2">
      <!-- Expand -->
      <div v-if="showExpand">
        <slot name="expand-icon" :item="item" :index="index">
          <button
            class="text-xl font-bold focus:outline-none"
            @click.stop="emits('toggle-expand', item)"
          >
            <span v-if="isExpanded">−</span>
            <span v-else>+</span>
          </button>
        </slot>
      </div>

      <!-- Select -->
      <div v-if="showSelect">
        <input
          type="checkbox"
          :checked="isSelected"
          @change.stop="emits('toggle-select', item)"
          class="form-checkbox w-5 h-5"
        />
      </div>
    </div>

    <!-- Datos -->
    <div class="flex flex-col gap-2">
      <div
        v-for="header in headers"
        :key="header.value"
        class="flex justify-between text-sm"
      >
        <div class="font-semibold text-slate-600 dark:text-slate-300">
          {{ header.label ?? header.text }}
        </div>
        <div
          class="text-right text-slate-800 dark:text-slate-100"
          :class="{
            'text-right': header.align === 'right',
            'text-center': header.align === 'center',
            'text-left': header.align === 'left' || !header.align,
          }"
        >
          <slot
            :name="`item.${header.value}`"
            :item="item"
            :value="getValue(header, item)"
            :index="index"
          >
            {{ formatValue(header, getValue(header, item)) }}
          </slot>
        </div>
      </div>
    </div>

    <!-- Acciones -->
    <div v-if="hasActions" class="flex justify-between items-start mt-4 text-sm">
      <div class="font-semibold text-slate-600 dark:text-slate-300">
        Acciones
      </div>
      <div class="text-right">
        <slot name="item.actions" :item="item" :index="index" :loading="loading" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { getValue, formatValue } from '@/utils/tableFormatters';

const props = defineProps({
  item: Object,
  index: Number,
  headers: Array,
  showExpand: Boolean,
  showSelect: Boolean,
  isExpanded: Boolean,
  isSelected: Boolean,
  hasActions: Boolean,
  loading: Boolean,
  rowClass: String,
});

const emits = defineEmits(['toggle-expand', 'toggle-select', 'row-click']);

const mergedContainerClass = [
  'border border-slate-300 dark:border-slate-700 rounded p-4 bg-white dark:bg-slate-900 shadow-sm',
  props.rowClass,
];
</script>
