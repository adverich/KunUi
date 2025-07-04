export default () => ({
    items: { type: Array, default: () => [] },
    selected: { type: Array, default: () => [] },
    headers: { type: Array, default: () => [] },
    hasActions: { type: Boolean, default: false },
    actionLabel: { type: String, default: 'Acciones' },
    actionsAlign: String,
    actionLoadingMap: { type: Object, default: () => ({}) },
    filterable: Boolean,
    filters: { type: Array, default: () => [] },
    customFilter: { type: Function, default: null },

    // Features
    itemsPerPage: { type: Number, default: 10 },
    page: { type: Number, default: 1 },
    sortBy: {
        type: [Array, String],
        default: () => []
    },
    mutliSort: Boolean,
    pageOptions: { type: Array, default: () => [5, 10, 25, 50, 100] },

    searchable: { type: Boolean, default: false },
    search: {
        type: String,
        default: ''
    },
    searchableKeys: { type: Array, default: null },
    searchPosition: {
        type: String,
        default: 'end', // 'start' | 'center' | 'end'
        validator: v => ['start', 'center', 'end'].includes(v),
    },
    searchPlaceholder: { type: String, default: 'Buscar...' },
    debounceTime: { type: Number, default: 300 },

    showSelect: { type: Boolean, default: false },
    showExpand: { type: Boolean, default: false },
    showGroupBy: { type: Boolean, default: false },

    // Display
    hideDefaultHeader: { type: Boolean, default: false },
    hideDefaultFooter: { type: Boolean, default: false },

    // Custom class props
    wrapperClass: { type: String, default: '' },
    tableClass: { type: String, default: '' },
    tbodyClass: { type: String, default: '' },
    theadClass: { type: String, default: '' },
    trClass: { type: String, default: '' },
    thClass: { type: String, default: '' },
    tdClass: { type: String, default: '' },
    selectedClass: { type: String, default: 'bg-blue-100' },
    stripedClass: { type: String, default: '' },
    tfootClass: { type: String, default: '', },
    rowClass: { type: String, default: '' },

    // Misc
    noDataText: { type: String, default: 'No hay elementos disponibles' },
    loadingText: { type: String, default: 'Cargando...' },

    // Slots control
    customSlots: Object,
    showTopSlot: { type: Boolean, default: false },
    showBottomSlot: { type: Boolean, default: false },
});
