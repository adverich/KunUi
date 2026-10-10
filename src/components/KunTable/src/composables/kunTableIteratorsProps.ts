import type { PropType } from 'vue';
import type { KunTableHeader } from '@/utils/tableFormatters.js';
import type { TableItem } from './useRowKey.js';

export const kunTableIteratorsProps = {
  /** Ítems paginados a renderizar como tarjetas. */
  items: { type: Array as PropType<TableItem[]>, default: () => [] as TableItem[] },
  /** Columnas a renderizar como filas etiqueta/valor. */
  headers: { type: Array as PropType<KunTableHeader[]>, default: () => [] as KunTableHeader[] },
  /** `(item) => boolean`: tarjeta expandida. */
  isExpanded: Function as PropType<(item: TableItem) => boolean>,
  /** `(item) => boolean`: tarjeta seleccionada. */
  isSelected: Function as PropType<(item: TableItem) => boolean>,
  /** Botón de expansión por tarjeta. */
  showExpand: Boolean,
  /** Checkbox por tarjeta. */
  showSelect: Boolean,
  /** Sección de acciones por tarjeta. */
  hasActions: Boolean,
  /** Mapa de loading de acciones por rowKey. */
  actionLoadingMap: Object as PropType<Record<string, unknown>>,
  /** `(item, index) => boolean`: loading de las acciones. */
  getActionLoading: {
    type: Function as PropType<(item: TableItem, index: number) => boolean>,
    default: () => false,
  },
  /** `(item, index) => key` estable para `:key`. */
  itemKey: {
    type: Function as PropType<(item: TableItem, index: number) => unknown>,
    default: (_: unknown, index: number) => index,
  },
  /** Celdas custom por columna (`item.<key>` → componente). */
  customSlots: Object as PropType<Record<string, unknown>>,
}
