import type { PropType } from 'vue';
import type { KunTableHeader } from '@/utils/tableFormatters.js';
import type { TableItem } from './useRowKey.js';

export const kunTableRowProps = {
  /** Ítem de la fila. */
  item: Object as PropType<TableItem>,
  /** Índice del ítem. */
  index: Number,
  /** Columnas a renderizar como celdas. */
  headers: { type: Array as PropType<KunTableHeader[]>, default: () => [] as KunTableHeader[] },
  /** Celda de expansión. */
  showExpand: Boolean,
  /** Celda de selección. */
  showSelect: Boolean,
  /** Fila expandida. */
  isExpanded: Boolean,
  /** Fila seleccionada. */
  isSelected: Boolean,
  /** Clase del `<tr>`. */
  rowClass: String,
  /** Clase extra del `<tr>` (se combina con `rowClass`). */
  trClass: String,
  /** Clase de cada `<td>`. */
  tdClass: String,
  /** Clase cuando está seleccionada. */
  selectedClass: String,
  /** Clase de filas alternas. */
  stripedClass: String,
  /** Columna de acciones. */
  hasActions: Boolean,
  /** Alineación de la columna de acciones. */
  actionsAlign: String,
  /** Estado de carga de las acciones. */
  loading: { type: [Boolean, Object], default: false },
  /** Clase condicional por ítem (string o `(item) => clase|false`). */
  rowClassCondition: [String, Function] as PropType<string | ((item: TableItem) => boolean)>,
  /** Celdas custom por columna (`item.<key>` → componente). */
  customSlots: Object as PropType<Record<string, unknown>>,
}
