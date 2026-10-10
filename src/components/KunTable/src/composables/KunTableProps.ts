import type { PropType } from 'vue';
import type { KunTableHeader } from '@/utils/tableFormatters.js';
import type { TableItem } from './useRowKey.js';
import type { TableFilterDefinition } from './kunTableFilterProps.js';

export type KunTableSearchPosition = 'start' | 'center' | 'end';

/**
 * Definición centralizada de las propiedades (props) para el componente KunTable.
 * Esto permite reutilizar la definición de propiedades en diferentes componentes si fuera necesario.
 */
export default () => ({
    // --- Datos ---
    /** Array de datos a mostrar. */
    items: { type: Array as PropType<TableItem[]>, default: () => [] as TableItem[] },
    /** (Deprecated) Usar v-model:selectedItems. */
    selected: { type: Array as PropType<TableItem[]>, default: () => [] as TableItem[] },
    /** Configuración de columnas `{ key, value, label, sortable, ... }`. */
    headers: { type: Array as PropType<KunTableHeader[]>, default: () => [] as KunTableHeader[] },

    // --- Acciones ---
    /** Muestra columna de acciones (slot `item.actions`). */
    hasActions: { type: Boolean, default: false },
    /** Etiqueta del header de acciones. */
    actionLabel: { type: String, default: 'Acciones' },
    /** Alineación de acciones: 'left' | 'center' | 'right'. */
    actionsAlign: String,
    /** Mapa de loading por rowKey para la columna de acciones. */
    actionLoadingMap: { type: Object as PropType<Record<string, unknown>>, default: () => ({}) },

    // --- Filtrado ---
    /** Habilita filtros avanzados por columna (modal). */
    filterable: Boolean,
    /** Configuración de filtros por columna. */
    filters: { type: Array as PropType<TableFilterDefinition[]>, default: () => [] as TableFilterDefinition[] },
    /** Función de filtrado personalizada `(item, key, value, header) => boolean`. */
    customFilter: { type: Function as unknown as PropType<((item: TableItem, key: string, value: unknown, header: KunTableHeader | undefined) => boolean) | null>, default: null },

    // --- Paginación y Ordenamiento ---
    /** Ítems por página. */
    itemsPerPage: { type: [Number, String], default: 10 },
    /** Página actual. */
    page: { type: [Number, String], default: 1 },
    /** Criterio de orden (v-model): string, objeto o array. */
    sortBy: {
        type: [Array, String] as PropType<string | { key: string; order: string }[]>,
        default: () => [] as { key: string; order: string }[]
    },
    /** Habilita ordenar por múltiples columnas. */
    mutliSort: Boolean,
    /** Opciones del selector de ítems por página. */
    pageOptions: { type: Array as PropType<number[]>, default: () => [5, 10, 25, 50, 100] },

    // --- Búsqueda Global ---
    /** Habilita barra de búsqueda. */
    searchable: { type: Boolean, default: false },
    /** Término de búsqueda (v-model). */
    search: {
        type: String,
        default: ''
    },
    /** Claves específicas donde buscar (null = todas las columnas). */
    searchableKeys: { type: Array as PropType<string[] | null>, default: null },
    /** Posición de la barra de búsqueda. */
    searchPosition: {
        type: String as PropType<KunTableSearchPosition>,
        default: 'end',
        validator: (v: unknown) => ['start', 'center', 'end'].includes(v as string),
    },
    /** Placeholder de la búsqueda. */
    searchPlaceholder: { type: String, default: 'Buscar...' },
    /** Debounce en ms para ejecutar la búsqueda. */
    debounceTime: { type: Number, default: 300 },

    // --- Funcionalidades de Fila ---
    /** Muestra checkboxes de selección. */
    showSelect: { type: Boolean, default: false },
    /** Habilita expansión de filas (slot `expand`). */
    showExpand: { type: Boolean, default: false },
    /** (Futuro) Agrupamiento. Actualmente sin efecto. */
    showGroupBy: { type: Boolean, default: false },
    /** Clave estable para identidad de filas ('id', path o función). */
    rowKey: { type: [String, Function] as PropType<string | ((item: TableItem, index: number) => unknown)>, default: 'id' },

    // --- Visualización y Estilos ---
    /** Oculta el header por defecto (usar slot `thead`). */
    hideDefaultHeader: { type: Boolean, default: false },
    /** Oculta el footer por defecto (usar slot `footer`). */
    hideDefaultFooter: { type: Boolean, default: false },
    /** Oculta el aviso de selección. */
    hideSelected: { type: Boolean, default: false },

    // Clases personalizadas
    /** Clase del contenedor principal. */
    wrapperClass: { type: String, default: '' },
    /** Clase del `<table>`. */
    tableClass: { type: String, default: '' },
    /** Clase del `<tbody>`. */
    tbodyClass: { type: String, default: '' },
    /** Clase del `<thead>`. */
    theadClass: { type: String, default: '' },
    /** Clase de las filas. */
    trClass: { type: String, default: '' },
    /** Clase de los headers. */
    thClass: { type: String, default: '' },
    /** Clase de las celdas (string o `(item) => clase`). */
    tdClass: { type: [String, Function] as PropType<string | ((item: TableItem) => string)>, default: '' },
    /** Clase de filas seleccionadas. */
    selectedClass: { type: String, default: 'bg-ui-selection text-ui-selection' },
    /** Clase de filas alternas. */
    stripedClass: { type: String, default: '' },
    /** Clase del `<tfoot>`. */
    tfootClass: { type: String, default: '', },
    /** Clase adicional para filas. */
    rowClass: { type: String, default: '' },
    /** Condición para aplicar `rowClass` (string o `(item) => boolean`). */
    rowClassCondition: { type: [String, Function] as PropType<string | ((item: TableItem) => boolean)>, default: '' },

    // --- Textos ---
    /** Texto cuando no hay datos. */
    noDataText: { type: String, default: 'No hay elementos disponibles' },
    /** Texto del estado de carga. */
    loadingText: { type: String, default: 'Cargando...' },

    // --- Control Avanzado ---
    /** Celdas custom (`item.<key>` → componente). */
    customSlots: { type: Object as PropType<Record<string, unknown>>, default: () => ({}) },
    /** Headers custom (`header.<key>` → componente). */
    customHeaders: { type: Object as PropType<Record<string, unknown>>, default: () => ({}) },
    /** Reservado. Actualmente sin efecto (usar slots `body.prepend`/`body.append`). */
    showTopSlot: { type: Boolean, default: false },
    /** Reservado. Actualmente sin efecto (usar slots `body.prepend`/`body.append`). */
    showBottomSlot: { type: Boolean, default: false },
    /** Mapa de funciones para columnas tipo 'function' (serialización). */
    functionMap: { type: Object as PropType<Record<string, (...args: never[]) => unknown>>, default: () => ({}) },
});
