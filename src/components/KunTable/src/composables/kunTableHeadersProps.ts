import type { PropType } from 'vue';
import type { KunTableHeader } from '@/utils/tableFormatters.js';
import type { TableItem } from './useRowKey.js';

export type SortByOption = { key: string; order: string }[] | string;

export const kunTableHeadersProps = {
  /** Columnas a renderizar. */
  headers: { type: Array as PropType<KunTableHeader[]>, default: () => [] as KunTableHeader[] },
  /** Columna de checkboxes. */
  showSelect: Boolean,
  /** Columna de expansión. */
  showExpand: Boolean,
  /** Todo expandido (alterna el botón global). */
  isExpanded: Boolean,
  /** Todas las filas seleccionadas (checkbox maestro). */
  allSelected: Boolean,
  /** Selección parcial (indeterminado). */
  someSelected: Boolean,
  /** Hay seleccionados fuera de la página. */
  moreThanPaginated: Boolean,
  /** Criterio de orden actual (para los íconos). */
  sortBy: Object as PropType<SortByOption>,
  /** Clase del `<thead>`. */
  theadClass: String,
  /** Clase de la fila de headers. */
  trClass: String,
  /** Clase de cada `<th>`. */
  thClass: String,
  /** Columna de acciones. */
  hasActions: Boolean,
  /** Etiqueta de la columna de acciones. */
  actionLabel: String,
  /** Headers custom por columna (`header.<key>` → componente). */
  customHeaders: Object as PropType<Record<string, unknown>>,
  /** Deshabilita el ordenamiento. */
  disabled: Boolean,
}
