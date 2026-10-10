import type { PropType } from 'vue';
import type { KunTableHeader } from '@/utils/tableFormatters.js';
import type { TableItem } from './useRowKey.js';

export type SortByOption = { key: string; order: string }[] | string;

export const kunTableHeadersProps = {
  headers: { type: Array as PropType<KunTableHeader[]>, default: () => [] as KunTableHeader[] },
  showSelect: Boolean,
  showExpand: Boolean,
  isExpanded: Boolean,
  allSelected: Boolean,
  someSelected: Boolean,
  moreThanPaginated: Boolean,
  sortBy: Object as PropType<SortByOption>,
  theadClass: String,
  trClass: String,
  thClass: String,
  hasActions: Boolean,
  actionLabel: String,
  customHeaders: Object as PropType<Record<string, unknown>>,
  disabled: Boolean,
}
