import type { PropType } from 'vue';
import type { KunTableHeader } from '@/utils/tableFormatters.js';
import type { TableItem } from './useRowKey.js';

export const kunTableIteratorsProps = {
  items: { type: Array as PropType<TableItem[]>, default: () => [] as TableItem[] },
  headers: { type: Array as PropType<KunTableHeader[]>, default: () => [] as KunTableHeader[] },
  isExpanded: Function as PropType<(item: TableItem) => boolean>,
  isSelected: Function as PropType<(item: TableItem) => boolean>,
  showExpand: Boolean,
  showSelect: Boolean,
  hasActions: Boolean,
  actionLoadingMap: Object as PropType<Record<string, unknown>>,
  getActionLoading: {
    type: Function as PropType<(item: TableItem, index: number) => boolean>,
    default: () => false,
  },
  itemKey: {
    type: Function as PropType<(item: TableItem, index: number) => unknown>,
    default: (_: unknown, index: number) => index,
  },
  customSlots: Object as PropType<Record<string, unknown>>,
}
