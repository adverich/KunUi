import type { PropType } from 'vue';
import type { KunTableHeader } from '@/utils/tableFormatters.js';
import type { TableItem } from './useRowKey.js';

export const kunTableIteratorProps = {
  /** Ítem de la tarjeta (vista móvil). */
  item: Object as PropType<TableItem>,
  /** Índice del ítem. */
  index: Number,
  /** Columnas a renderizar como filas etiqueta/valor. */
  headers: { type: Array as PropType<KunTableHeader[]>, default: () => [] as KunTableHeader[] },
  /** Botón de expansión. */
  showExpand: Boolean,
  /** Checkbox de selección. */
  showSelect: Boolean,
  /** Tarjeta expandida. */
  isExpanded: Boolean,
  /** Tarjeta seleccionada. */
  isSelected: Boolean,
  /** Sección de acciones. */
  hasActions: Boolean,
  /** Estado de carga de las acciones. */
  loading: { type: [Boolean, Object], default: false },
  /** Clase del contenedor. */
  rowClass: String,
  /** Clase cuando está seleccionada. */
  selectedClass: String,
  /** Borde de la tarjeta. */
  border: { type: String, default: 'border border-ui' },
  /** Redondeo de la tarjeta. */
  rounded: { type: String, default: 'rounded-sm' },
  /** Clase condicional por ítem (string o `(item) => clase|false`). */
  rowClassCondition: [String, Function] as PropType<string | ((item: TableItem) => boolean)>,
  /** Celdas custom por columna (`item.<key>` → componente). */
  customSlots: Object as PropType<Record<string, unknown>>,
}
