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
    items: { type: Array as PropType<TableItem[]>, default: () => [] as TableItem[] }, // Array de datos a mostrar
    selected: { type: Array as PropType<TableItem[]>, default: () => [] as TableItem[] }, // (Deprecated) Usar v-model:selectedItems
    headers: { type: Array as PropType<KunTableHeader[]>, default: () => [] as KunTableHeader[] }, // Configuración de columnas

    // --- Acciones ---
    hasActions: { type: Boolean, default: false }, // Muestra columna de acciones
    actionLabel: { type: String, default: 'Acciones' }, // Etiqueta del header de acciones
    actionsAlign: String, // Alineación de acciones: 'left' | 'center' | 'right'
    actionLoadingMap: { type: Object as PropType<Record<string, unknown>>, default: () => ({}) }, // Mapa de loading state por ID de item

    // --- Filtrado ---
    filterable: Boolean, // Habilita filtros avanzados
    filters: { type: Array as PropType<TableFilterDefinition[]>, default: () => [] as TableFilterDefinition[] }, // Configuración de filtros por columna
    customFilter: { type: Function as unknown as PropType<((item: TableItem, key: string, value: unknown, header: KunTableHeader | undefined) => boolean) | null>, default: null }, // Función de filtrado personalizada

    // --- Paginación y Ordenamiento ---
    itemsPerPage: { type: [Number, String], default: 10 },
    page: { type: [Number, String], default: 1 },
    sortBy: {
        type: [Array, String] as PropType<string | { key: string; order: string }[]>,
        default: () => [] as { key: string; order: string }[]
    },
    mutliSort: Boolean, // Habilita ordenar por múltiples columnas
    pageOptions: { type: Array as PropType<number[]>, default: () => [5, 10, 25, 50, 100] }, // Opciones del selector de items por página

    // --- Búsqueda Global ---
    searchable: { type: Boolean, default: false }, // Habilita barra de búsqueda
    search: {
        type: String,
        default: ''
    },
    searchableKeys: { type: Array as PropType<string[] | null>, default: null }, // Claves específicas donde buscar (si es null busca en todas)
    searchPosition: {
        type: String as PropType<KunTableSearchPosition>,
        default: 'end', // 'start' | 'center' | 'end'
        validator: (v: unknown) => ['start', 'center', 'end'].includes(v as string),
    },
    searchPlaceholder: { type: String, default: 'Buscar...' },
    debounceTime: { type: Number, default: 300 }, // Tiempo de espera para ejecutar búsqueda

    // --- Funcionalidades de Fila ---
    showSelect: { type: Boolean, default: false }, // Muestra checkboxes de selección
    showExpand: { type: Boolean, default: false }, // Habilita expansión de filas
    showGroupBy: { type: Boolean, default: false }, // (Futuro) Agrupamiento
    rowKey: { type: [String, Function] as PropType<string | ((item: TableItem, index: number) => unknown)>, default: 'id' }, // Clave estable para identidad de filas

    // --- Visualización y Estilos ---
    hideDefaultHeader: { type: Boolean, default: false },
    hideDefaultFooter: { type: Boolean, default: false },
    hideSelected: { type: Boolean, default: false },

    // Clases personalizadas
    wrapperClass: { type: String, default: '' },
    tableClass: { type: String, default: '' },
    tbodyClass: { type: String, default: '' },
    theadClass: { type: String, default: '' },
    trClass: { type: String, default: '' },
    thClass: { type: String, default: '' },
    tdClass: { type: [String, Function] as PropType<string | ((item: TableItem) => string)>, default: '' },
    selectedClass: { type: String, default: 'bg-ui-selection text-ui-selection' },
    stripedClass: { type: String, default: '' },
    tfootClass: { type: String, default: '', },
    rowClass: { type: String, default: '' },
    rowClassCondition: { type: [String, Function] as PropType<string | ((item: TableItem) => boolean)>, default: '' },

    // --- Textos ---
    noDataText: { type: String, default: 'No hay elementos disponibles' },
    loadingText: { type: String, default: 'Cargando...' },

    // --- Control Avanzado ---
    customSlots: { type: Object as PropType<Record<string, unknown>>, default: () => ({}) },
    customHeaders: { type: Object as PropType<Record<string, unknown>>, default: () => ({}) },
    showTopSlot: { type: Boolean, default: false },
    showBottomSlot: { type: Boolean, default: false },
    functionMap: { type: Object as PropType<Record<string, (...args: never[]) => unknown>>, default: () => ({}) }, // Mapa de funciones para columnas tipo 'function' (serialización)
});
