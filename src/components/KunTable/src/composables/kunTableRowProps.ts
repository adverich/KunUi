import type { PropType } from 'vue';
import type { KunTableHeader } from '@/utils/tableFormatters.js';
import type { TableItem } from './useRowKey.js';

export const kunTableRowProps = {
  item: Object as PropType<TableItem>,
  index: Number,
  headers: { type: Array as PropType<KunTableHeader[]>, default: () => [] as KunTableHeader[] },
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
  rowClassCondition: [String, Function] as PropType<string | ((item: TableItem) => boolean)>,
  customSlots: Object as PropType<Record<string, unknown>>,
}
