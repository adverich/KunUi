import { computed, watch, reactive } from 'vue';

export default function useOptions(props, emits, filteredItems) {
    const { page, itemsPerPage, sortBy, mutliSort } = props;

    const normalizeSortBy = (rawSortBy) => {
        if (typeof rawSortBy === 'string') {
            return [{ key: rawSortBy, order: 'asc' }];
        }

        if (Array.isArray(rawSortBy)) {
            return rawSortBy.map(s => typeof s === 'string' ? { key: s, order: 'asc' } : s);
        }

        return [];
    };

    const options = reactive({
        page: page.value,
        itemsPerPage: itemsPerPage.value,
        sortBy: normalizeSortBy(sortBy.value),
    });

    watch(() => page.value, (val) => options.page = val);
    watch(() => itemsPerPage.value, (val) => options.itemsPerPage = val);
    watch(() => options.sortBy, (val) => emits?.('update:sortBy', val));

    watch(() => options.page, (val) => emits?.('update:page', val));
    watch(() => options.itemsPerPage, (val) => emits?.('update:itemsPerPage', val));

    const startIndex = computed(() => (options.page - 1) * options.itemsPerPage);
    const endIndex = computed(() => startIndex.value + options.itemsPerPage);

    const sortedItems = computed(() => {
        if (!Array.isArray(filteredItems.value)) return [];
        if (!options.sortBy.length) return filteredItems.value;

        // Helper para parsear números formateados
        const parseNumber = (val) => {
            if (typeof val === 'number') return val;
            if (typeof val === 'string') {
                // Si contiene letras, no lo tratamos como número (para evitar romper orden de códigos alfanuméricos)
                if (/[a-zA-Z]/.test(val)) return val;

                const clean = val.replace(/[^\d.,-]/g, '');
                // Formato Latam/EU: 1.000,00 (puntos mil, coma decimal)
                // Acepta: 1.000,00 o 1000,00 o 1,00
                if (/^-?(\d{1,3}(\.\d{3})*|\d+),\d+$/.test(clean)) {
                    return parseFloat(clean.replace(/\./g, '').replace(',', '.'));
                }
                // Formato Estándar/Integer: 1234.56 o 1234
                if (/^-?\d+(\.\d+)?$/.test(clean)) {
                    return parseFloat(clean);
                }
            }
            return val;
        };

        return [...filteredItems.value].sort((a, b) => {
            for (const { key, order } of options.sortBy) {
                const aVal = a[key];
                const bVal = b[key];

                if (aVal == null && bVal == null) continue;
                if (aVal == null) return order === 'asc' ? -1 : 1;
                if (bVal == null) return order === 'asc' ? 1 : -1;

                // Comparación para fechas
                if (aVal instanceof Date && bVal instanceof Date) {
                    const diff = aVal.getTime() - bVal.getTime();
                    if (diff !== 0) return order === 'asc' ? diff : -diff;
                    continue;
                }

                // Intentar parsear valores a números para comparación numérica correcta
                const numA = parseNumber(aVal);
                const numB = parseNumber(bVal);

                if (typeof numA === 'number' && typeof numB === 'number') {
                    const diff = numA - numB;
                    if (diff !== 0) return order === 'asc' ? diff : -diff;
                    continue;
                }

                // Comparación para strings (case-insensitive)
                if (typeof aVal === 'string' && typeof bVal === 'string') {
                    const diff = aVal.localeCompare(bVal, undefined, { sensitivity: 'base' });
                    if (diff !== 0) return order === 'asc' ? diff : -diff;
                    continue;
                }

                // Comparación fallback
                if (aVal !== bVal) return order === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
            }

            return 0;
        });
    });

    const paginatedItems = computed(() => {
        return sortedItems.value.slice(startIndex.value, endIndex.value);
    });

    const updateSort = ({ key, order }) => {
        const existing = options.sortBy.find(s => s.key === key);
        if (existing) {
            existing.order = order;
        } else {
            if (mutliSort.value) {
                options.sortBy.push({ key, order });
            } else {
                options.sortBy = [{ key, order }]
            }
        };
    };

    return {
        options,
        paginatedItems,
        updateSort,
        sortedItems
    };
}