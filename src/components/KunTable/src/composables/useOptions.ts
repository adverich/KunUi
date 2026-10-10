import { computed, watch, reactive, ref, type Ref, type ComputedRef } from 'vue';
import { getValue, type KunTableHeader } from '@/utils/tableFormatters.js'
import type { TableItem } from './useRowKey.js'

export interface SortCriterion { key: string; order: string }

export interface OptionsRefsLike {
    page: Ref<number | string>;
    itemsPerPage: Ref<number | string>;
    sortBy: Ref<string | SortCriterion[]>;
    mutliSort: Ref<boolean>;
    headers?: Ref<KunTableHeader[]> | KunTableHeader[];
}

export type OptionsEmit = (event: 'update:sortBy' | 'update:page' | 'update:itemsPerPage', value: unknown) => void;

export default function useOptions(
    props: OptionsRefsLike,
    emits: OptionsEmit | undefined,
    filteredItems: Ref<TableItem[]> | ComputedRef<TableItem[]>,
    headers: Ref<KunTableHeader[]> | ComputedRef<KunTableHeader[]> | undefined,
) {
    const { page, itemsPerPage, sortBy, mutliSort } = props;

    const normalizeSortBy = (rawSortBy: string | SortCriterion[]): SortCriterion[] => {
        if (typeof rawSortBy === 'string') {
            return [{ key: rawSortBy, order: 'asc' }];
        }

        if (Array.isArray(rawSortBy)) {
            return rawSortBy.map((s: string | SortCriterion) => typeof s === 'string' ? { key: s, order: 'asc' } : s);
        }

        return [];
    };

    const internalSortBy: Ref<SortCriterion[]> = ref(normalizeSortBy(sortBy.value as string | SortCriterion[]));

    const options = reactive({
        page: Number(page.value),
        itemsPerPage: Number(itemsPerPage.value),
        get sortBy() { return internalSortBy.value; },
        set sortBy(val: SortCriterion[]) { internalSortBy.value = val; }
    });

    watch(() => page.value, (val: number | string) => options.page = Number(val));
    watch(() => itemsPerPage.value, (val: number | string) => options.itemsPerPage = Number(val));

    watch(internalSortBy, (val: SortCriterion[]) => {
        emits?.('update:sortBy', val);
    }, { deep: true });

    watch(() => options.page, (val: number) => emits?.('update:page', val));
    watch(() => options.itemsPerPage, (val: number) => emits?.('update:itemsPerPage', val));

    // Índices para slice de paginación
    const startIndex = computed(() => (options.page - 1) * options.itemsPerPage);
    const endIndex = computed(() => startIndex.value + options.itemsPerPage);

    // --- Lógica de Ordenamiento ---
    const sortedItems = computed(() => {
        if (!Array.isArray(filteredItems.value)) return [];
        // Si no hay criterio de orden, retorna items filtrados tal cual
        if (!options.sortBy.length) return filteredItems.value;

        // Pre-carga de headers para optimizar búsqueda en el loop de sort
        const sortConfigs = options.sortBy.map((s: SortCriterion) => {
            const headerList = headers || props.headers;
            const headerArr: KunTableHeader[] | undefined = Array.isArray(headerList)
                ? (headerList as KunTableHeader[])
                : (headerList as Ref<KunTableHeader[]> | ComputedRef<KunTableHeader[]> | undefined)?.value;
            const header = headerArr?.find((h: KunTableHeader) => h.value === s.key);
            return {
                ...s,
                header
            };
        });

        // Helper para detectar y parsear números con distintos formatos locales
        const parseNumber = (val: unknown): unknown => {
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

        return [...filteredItems.value].sort((a: TableItem, b: TableItem) => {
            for (const { key, order, header } of sortConfigs) {
                // Obtiene valor usando helper getValue para soportar:
                // - Propiedades directas (item.prop)
                // - Propiedades anidadas (item.obj.prop) via 'relationPath'
                // - Funciones transformadoras via 'columnFunction'
                const aVal = header ? getValue(header, a) : a[key];
                const bVal = header ? getValue(header, b) : b[key];

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
                if (aVal !== bVal) return order === 'asc' ? ((aVal as number) > (bVal as number) ? 1 : -1) : ((aVal as number) < (bVal as number) ? 1 : -1);
            }

            return 0;
        });
    });

    // Retorna solo los items de la página actual
    const paginatedItems = computed(() => {
        return sortedItems.value.slice(startIndex.value, endIndex.value);
    });

    // Función para manejar clic en header de columna
    const updateSort = ({ key, order }: { key: string; order: string }): void => {
        const existing = options.sortBy.find((s: SortCriterion) => s.key === key);
        if (existing) {
            existing.order = order;
        } else {
            if (mutliSort.value) {
                options.sortBy.push({ key, order });
            } else {
                options.sortBy = [{ key, order }]
            }
        }
    };

    return {
        options,
        paginatedItems,
        updateSort,
        sortedItems
    };
}
