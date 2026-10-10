import type { PropType } from 'vue';

export interface TableFilterDefinition {
    value: string;
    label?: string;
    title?: string;
    text?: string;
    name?: string;
    items?: unknown[];
    'item-value'?: string;
    placeholderText?: string;
    textNoItem?: string;
    [key: string]: unknown;
}

export const kunTableFilterProps = {
  modelValue: Boolean,
  filters: { type: Array as PropType<TableFilterDefinition[]>, default: () => [] as TableFilterDefinition[] },
  activeFilters: { type: Object as PropType<Record<string, unknown>>, default: () => ({}) },
}
