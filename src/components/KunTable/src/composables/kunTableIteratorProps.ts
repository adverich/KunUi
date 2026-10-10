import type { PropType } from 'vue';
import type { KunTableHeader } from '@/utils/tableFormatters.js';
import type { TableItem } from './useRowKey.js';

export const kunTableIteratorProps = {
  item: Object as PropType<TableItem>,
  index: Number,
  headers: { type: Array as PropType<KunTableHeader[]>, default: () => [] as KunTableHeader[] },
  showExpand: Boolean,
  showSelect: Boolean,
  isExpanded: Boolean,
  isSelected: Boolean,
  hasActions: Boolean,
  loading: { type: [Boolean, Object], default: false },
  rowClass: String,
  selectedClass: String,
  border: { type: String, default: 'border border-ui' },
  rounded: { type: String, default: 'rounded-sm' },
  rowClassCondition: [String, Function] as PropType<string | ((item: TableItem) => boolean)>,
  customSlots: Object as PropType<Record<string, unknown>>,
}
