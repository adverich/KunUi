import { computed, watch, reactive } from 'vue';
import { getValue } from '@/utils/tableFormatters'

/**
 * Composable para manejar opciones de visualización de la tabla:
 * - Paginación (página actual, items por página)
 * - Ordenamiento (simple o múltiple)
 */
export default function useOptions(props, emits, filteredItems, headers) {
    const { page, itemsPerPage, sortBy, mutliSort } = props;

    // Normaliza el formato de ordenamiento a un array de objetos {key, order}
    // Acepta string ('key') o array (['key', {key: 'other', order: 'desc'}])
    const normalizeSortBy = (rawSortBy) => {
        if (typeof rawSortBy === 'string') {
            return [{ key: rawSortBy, order: 'asc' }];
        }

        if (Array.isArray(rawSortBy)) {
            return rawSortBy.map(s => typeof s === 'string' ? { key: s, order: 'asc' } : s);
        }

        return [];
    };

    // Estado reactivo interno para opciones
    const options = reactive({
        page: page.value,
        itemsPerPage: itemsPerPage.value,
        sortBy: normalizeSortBy(sortBy.value),
    });

    // --- Sincronización bidireccional de props <-> estado interno ---
    watch(() => page.value, (val) => options.page = val);
    watch(() => itemsPerPage.value, (val) => options.itemsPerPage = val);

    // Sincronizar cambios externos de sortBy
    // Solo se actualiza si el padre cambia el prop a un valor diferente al estado interno
    // El estado interno (options.sortBy) es la fuente de verdad para ordenamiento
    watch(() => sortBy.value, (val) => {
        const normalized = normalizeSortBy(val);
        const currentStr = JSON.stringify(options.sortBy);
        const newStr = JSON.stringify(normalized);
        if (currentStr !== newStr) {
            options.sortBy = normalized;
        }
    }, { deep: true });

    watch(() => options.sortBy, (val) => {
        emits?.('update:sortBy', val);
    }, { deep: true });

    watch(() => options.page, (val) => emits?.('update:page', val));
    watch(() => options.itemsPerPage, (val) => emits?.('update:itemsPerPage', val));

    // Índices para slice de paginación
    const startIndex = computed(() => (options.page - 1) * options.itemsPerPage);
    const endIndex = computed(() => startIndex.value + options.itemsPerPage);

    // --- Lógica de Ordenamiento ---
    const sortedItems = computed(() => {
        if (!Array.isArray(filteredItems.value)) return [];
        // Si no hay criterio de orden, retorna items filtrados tal cual
        if (!options.sortBy.length) return filteredItems.value;

        // Pre-carga de headers para optimizar búsqueda en el loop de sort
        const sortConfigs = options.sortBy.map(s => {
            const headerList = headers || props.headers;
            const header = headerList.value?.find(h => h.value === s.key);
            return {
                ...s,
                header
            };
        });

        // Helper para detectar y parsear números con distintos formatos locales
        const parseNumber = (val) => {
            if (typeof val === 'number') return val;
            if (typeof val === 'string') {
                // Si contiene letras, se asume texto (ej: códigos alfanuméricos)
                if (/[a-zA-Z]/.test(val)) return val;

                const clean = val.replace(/[^\d.,-]/g, '');
                // Formato Latam/EU: 1.000,00
                if (/^-?(\d{1,3}(\.\d{3})*|\d+),\d+$/.test(clean)) {
                    return parseFloat(clean.replace(/\./g, '').replace(',', '.'));
                }
                // Formato Estándar/Integer: 1234.56
                if (/^-?\d+(\.\d+)?$/.test(clean)) {
                    return parseFloat(clean);
                }
            }
            return val;
        };

        return [...filteredItems.value].sort((a, b) => {
            for (const { key, order, header } of sortConfigs) {
                // Obtiene valor usando helper getValue para soportar:
                // - Propiedades directas (item.prop)
                // - Propiedades anidadas (item.obj.prop) via 'relationPath'
                // - Funciones transformadoras via 'columnFunction'
                let aVal = header ? getValue(header, a) : a[key];
                let bVal = header ? getValue(header, b) : b[key];

                if (aVal == null && bVal == null) continue;
                if (aVal == null) return order === 'asc' ? -1 : 1;
                if (bVal == null) return order === 'asc' ? 1 : -1;

                // 1. Comparación de Fechas
                if (aVal instanceof Date && bVal instanceof Date) {
                    const diff = aVal.getTime() - bVal.getTime();
                    if (diff !== 0) return order === 'asc' ? diff : -diff;
                    continue;
                }

                // 2. Comparación Numérica
                const numA = parseNumber(aVal);
                const numB = parseNumber(bVal);

                if (typeof numA === 'number' && typeof numB === 'number') {
                    const diff = numA - numB;
                    if (diff !== 0) return order === 'asc' ? diff : -diff;
                    continue;
                }

                // 3. Comparación de Strings (Locale aware)
                if (typeof aVal === 'string' && typeof bVal === 'string') {
                    const diff = aVal.localeCompare(bVal, undefined, { sensitivity: 'base' });
                    if (diff !== 0) return order === 'asc' ? diff : -diff;
                    continue;
                }

                // 4. Fallback (operadores básicos)
                if (aVal !== bVal) return order === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
            }

            return 0;
        });
    });

    // Retorna solo los items de la página actual
    const paginatedItems = computed(() => {
        return sortedItems.value.slice(startIndex.value, endIndex.value);
    });

    // Función para manejar clic en header de columna
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