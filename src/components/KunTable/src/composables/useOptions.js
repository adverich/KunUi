import { computed, watch, reactive } from 'vue';

export default function useOptions(props, emits, filteredItems) {
    const { page, itemsPerPage, sortBy } = props;

    const options = reactive({
        page: page.value,
        itemsPerPage: itemsPerPage.value,
        sortBy: [...sortBy.value || []],
    });

    watch(() => page.value, (val) => options.page = val);
    watch(() => itemsPerPage.value, (val) => options.itemsPerPage = val);
    watch(() => sortBy.value, (val) => options.sortBy = [...val]);

    watch(() => options.page, (val) => emits?.('update:page', val));
    watch(() => options.itemsPerPage, (val) => emits?.('update:itemsPerPage', val));
    watch(() => options.sortBy, (val) => emits?.('update:sortBy', val));

    const startIndex = computed(() => (options.page - 1) * options.itemsPerPage);
    const endIndex = computed(() => startIndex.value + options.itemsPerPage);

    const sortedItems = computed(() => {
        if (!Array.isArray(filteredItems.value)) return [];
        if (!options.sortBy.length) return filteredItems.value;

        return [...filteredItems.value].sort((a, b) => {
            for (const { key, order } of options.sortBy) {
                const aVal = a[key];
                const bVal = b[key];
                if (aVal !== bVal) {
                    return order === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
                }
            }
            return 0;
        });
    });

    const paginatedItems = computed(() => {
        return sortedItems.value.slice(startIndex.value, endIndex.value);
    });

    const updateSort = (key) => {
        const existing = options.sortBy.find(s => s.key === key);
        if (existing) {
            existing.order = existing.order === 'asc' ? 'desc' : 'asc';
        } else {
            options.sortBy = [{ key, order: 'asc' }];
        }
    };

    return {
        options,
        paginatedItems,
        updateSort,
        sortedItems
    };
}