import type { PropType } from 'vue';
import type { KunTableHeader } from '@/utils/tableFormatters.js';
import type { TableItem } from './useRowKey.js';
import type { KunTableActionsAlign } from './KunTableProps.js';

export const kunTableRowsProps = {
  /** Ítems paginados del `<tbody>`. */
  items: { type: Array as PropType<TableItem[]>, default: () => [] as TableItem[] },
  /** Clase del `<tbody>`. */
  tbodyClass: String,
  /** `(item) => boolean`: fila expandida (requerido). */
  isExpanded: {
    type: Function as PropType<(item: TableItem) => boolean>,
    required: true as const,
  },
  /** `(item) => boolean`: fila seleccionada (requerido). */
  isSelected: {
    type: Function as PropType<(item: TableItem) => boolean>,
    required: true as const,
  },
  /** `(item, index) => key` estable para `:key`. */
  itemKey: {
    type: Function as PropType<(item: TableItem, index: number) => unknown>,
    default: (_: unknown, index: number) => index,
  },
  /** Columnas a renderizar. */
  headers: { type: Array as PropType<KunTableHeader[]>, default: () => [] as KunTableHeader[] },
  /** Columna de expansión. */
  showExpand: Boolean,
  /** Columna de selección. */
  showSelect: Boolean,
  /** Columna de acciones. */
  hasActions: Boolean,
  /** Alineación de la columna de acciones (se reenvía a KunTableRow). */
  actionsAlign: {
    type: String as PropType<KunTableActionsAlign>,
    default: 'center',
    validator: (v: unknown) => ['left', 'center', 'right'].includes(v as string),
  },
  /** Estado de carga global. */
  loading: Boolean,
  /** Mapa de loading de acciones por rowKey. */
  actionLoadingMap: Object as PropType<Record<string, unknown>>,
  /** `(item, index) => boolean`: loading de las acciones. */
  getActionLoading: {
    type: Function as PropType<(item: TableItem, index: number) => boolean>,
    default: () => false,
  },
  /** Celdas custom por columna (`item.<key>` → componente). */
  customSlots: Object as PropType<Record<string, unknown>>,
}
