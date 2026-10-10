import type { PropType } from 'vue';
import type { KunTableHeader } from '@/utils/tableFormatters.js';
import type { TableItem } from './useRowKey.js';

export const kunTableRowsProps = {
  items: { type: Array as PropType<TableItem[]>, default: () => [] as TableItem[] },
  tbodyClass: String,
  isExpanded: {
    type: Function as PropType<(item: TableItem) => boolean>,
    required: true as const,
  },
  isSelected: {
    type: Function as PropType<(item: TableItem) => boolean>,
    required: true as const,
  },
  itemKey: {
    type: Function as PropType<(item: TableItem, index: number) => unknown>,
    default: (_: unknown, index: number) => index,
  },
  headers: { type: Array as PropType<KunTableHeader[]>, default: () => [] as KunTableHeader[] },
  showExpand: Boolean,
  showSelect: Boolean,
  hasActions: Boolean,
  loading: Boolean,
  actionLoadingMap: Object as PropType<Record<string, unknown>>,
  getActionLoading: {
    type: Function as PropType<(item: TableItem, index: number) => boolean>,
    default: () => false,
  },
  customSlots: Object as PropType<Record<string, unknown>>,
}
