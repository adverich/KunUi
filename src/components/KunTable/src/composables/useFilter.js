import { computed, reactive, watch, ref } from 'vue';
import { debounce } from '../../../../utils/utils.js'

export default function useFilter(props, debounceTime) {
    const appliedFilters = reactive({
        search: '',
        byColumn: {},
    });
    const { items, customFilter, searchableKeys } = props;

    const modalFilter = ref(false);
    const defaultFilterFn = (itemValue, filterValue) => {
        if (itemValue == null) return false;
        return String(itemValue).toLowerCase().includes(String(filterValue).toLowerCase());
    };

    const matchesFilter = (item, key, value) => {
        const itemValue = item[key];

        if (typeof customFilter?.value === 'function') {
            return customFilter.value(item, key, value);
        }

        if (Array.isArray(value)) {
            return value.some((v) => defaultFilterFn(itemValue, v));
        }

        return defaultFilterFn(itemValue, value);
    };

    const filteredItems = computed(() => {
        if (!Array.isArray(items.value)) return [];

        return items.value.filter((item) => {
            if (appliedFilters.search) {
                const keys = searchableKeys.value || Object.keys(item);
                const matches = keys.some((key) => matchesFilter(item, key, appliedFilters.search));
                if (!matches) return false;
            }

            for (const key in appliedFilters.byColumn) {
                const value = appliedFilters.byColumn[key];
                if (value != null && value !== '') {
                    if (!matchesFilter(item, key, value)) return false;
                }
            }
            return true;
        });
    });

    const setSearch = debounce((value) => {
        appliedFilters.search = value?.toString().toLowerCase() || ''
    }, debounceTime) // Delay configurable

    const setColumnFilter = (key, value) => {
        appliedFilters.byColumn[key] = value;
    };

    function applyColumnFilters(columnFilters) {
        for (const key in columnFilters) {
            setColumnFilter(key, columnFilters[key]);
        }
    }

    const clearFilters = () => {
        appliedFilters.search = '';
        appliedFilters.byColumn = {};
    };

    watch(() => items.value, () => { }, { deep: true });

    return {
        modalFilter,
        appliedFilters,
        filteredItems,
        setSearch,
        applyColumnFilters,
        clearFilters,
    };
}