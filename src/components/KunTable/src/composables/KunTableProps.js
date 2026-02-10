/**
 * Definición centralizada de las propiedades (props) para el componente KunTable.
 * Esto permite reutilizar la definición de propiedades en diferentes componentes si fuera necesario.
 */
export default () => ({
    // --- Datos ---
    items: { type: Array, default: () => [] }, // Array de datos a mostrar
    selected: { type: Array, default: () => [] }, // (Deprecated) Usar v-model:selectedItems
    headers: { type: Array, default: () => [] }, // Configuración de columnas

    // --- Acciones ---
    hasActions: { type: Boolean, default: false }, // Muestra columna de acciones
    actionLabel: { type: String, default: 'Acciones' }, // Etiqueta del header de acciones
    actionsAlign: String, // Alineación de acciones: 'left' | 'center' | 'right'
    actionLoadingMap: { type: Object, default: () => ({}) }, // Mapa de loading state por ID de item

    // --- Filtrado ---
    filterable: Boolean, // Habilita filtros avanzados
    filters: { type: Array, default: () => [] }, // Configuración de filtros por columna
    customFilter: { type: Function, default: null }, // Función de filtrado personalizada

    // --- Paginación y Ordenamiento ---
    itemsPerPage: { type: [Number, String], default: 10 },
    page: { type: [Number, String], default: 1 },
    sortBy: {
        type: [Array, String],
        default: () => []
    },
    mutliSort: Boolean, // Habilita ordenar por múltiples columnas
    pageOptions: { type: Array, default: () => [5, 10, 25, 50, 100] }, // Opciones del selector de items por página

    // --- Búsqueda Global ---
    searchable: { type: Boolean, default: false }, // Habilita barra de búsqueda
    search: {
        type: String,
        default: ''
    },
    searchableKeys: { type: Array, default: null }, // Claves específicas donde buscar (si es null busca en todas)
    searchPosition: {
        type: String,
        default: 'end', // 'start' | 'center' | 'end'
        validator: v => ['start', 'center', 'end'].includes(v),
    },
    searchPlaceholder: { type: String, default: 'Buscar...' },
    debounceTime: { type: Number, default: 300 }, // Tiempo de espera para ejecutar búsqueda

    // --- Funcionalidades de Fila ---
    showSelect: { type: Boolean, default: false }, // Muestra checkboxes de selección
    showExpand: { type: Boolean, default: false }, // Habilita expansión de filas
    showGroupBy: { type: Boolean, default: false }, // (Futuro) Agrupamiento

    // --- Visualización y Estilos ---
    hideDefaultHeader: { type: Boolean, default: false },
    hideDefaultFooter: { type: Boolean, default: false },

    // Clases personalizadas
    wrapperClass: { type: String, default: '' },
    tableClass: { type: String, default: '' },
    tbodyClass: { type: String, default: '' },
    theadClass: { type: String, default: '' },
    trClass: { type: String, default: '' },
    thClass: { type: String, default: '' },
    tdClass: { type: [String, Function], default: '' },
    selectedClass: { type: String, default: 'bg-blue-100' },
    stripedClass: { type: String, default: '' },
    tfootClass: { type: String, default: '', },
    rowClass: { type: String, default: '' },
    rowClassCondition: { type: [String, Function], default: '' },

    // --- Textos ---
    noDataText: { type: String, default: 'No hay elementos disponibles' },
    loadingText: { type: String, default: 'Cargando...' },

    // --- Control Avanzado ---
    customSlots: { type: Object, default: () => ({}) },
    customHeaders: { type: Object, default: () => ({}) },
    showTopSlot: { type: Boolean, default: false },
    showBottomSlot: { type: Boolean, default: false },
    functionMap: { type: Object, default: () => ({}) }, // Mapa de funciones para columnas tipo 'function' (serialización)
});
