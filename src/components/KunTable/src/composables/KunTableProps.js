export default () => ({
    items: {
        type: Array,
        default: () => [],
    },
    headers: {
        type: Array,
        default: () => [],
    },
    hasActions: {
        type: Boolean,
        default: false,
    },
    actionLabel: {
        type: String,
        default: 'Acciones',
    },
    actionsAlign: String,
    actionLoadingMap: {
        type: Object,
        default: () => ({}), // ej. { 3: true, 5: false }
    },
    filterable: Boolean,
    filters: {
        type: Array,
        default: () => [],
    },
    customFilter: { type: Function, default: null },

    // Features
    itemsPerPage: {
        type: Number,
        default: 10,
    },
    page: {
        type: Number,
        default: 1,
    },
    sortBy: {
        type: Array,
        default: () => [],
    },
    pageOptions: {
        type: Array,
        default: () => [5, 10, 25, 50, 100],
    },

    searchable: { type: Boolean, default: false },
    searchableKeys: { type: Array, default: null },
    searchPosition: {
        type: String,
        default: 'end', // 'start' | 'center' | 'end'
        validator: v => ['start', 'center', 'end'].includes(v),
    },
    searchPlaceholder: { type: String, default: 'Search...' },
    debounceTime: { type: Number, default: 300 },

    showSelect: Boolean,
    showExpand: Boolean,
    showGroupBy: Boolean,

    // Display
    hideDefaultHeader: Boolean,
    hideDefaultFooter: Boolean,

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
    rowClass: String,

    // Misc
    noDataText: { type: String, default: 'No data available' },
    loadingText: { type: String, default: 'Loading...' },

    // Slots control
    showTopSlot: Boolean,
    showBottomSlot: Boolean,
});
