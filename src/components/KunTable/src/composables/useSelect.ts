import { computed, watch, type Ref, type ComputedRef } from 'vue';
import type { TableItem } from './useRowKey.js';

export type ResolveItemKey = (item: TableItem, index?: number) => unknown;

/**
 * Identidad de un conjunto de items, resuelta UNA vez.
 * - `keySet`: claves resueltas de items con clave (comparación por valor).
 * - `refSet`: referencias de items sin clave (fallback por identidad de objeto).
 */
interface ItemIdentity {
    keySet: Set<unknown>;
    refSet: Set<TableItem>;
}

/**
 * Composable para manejo de selección de filas.
 * Soporta:
 * - Selección individual (toggle).
 * - Selección de página completa.
 * - Selección de TODO el dataset (incluso lo no visible).
 * - Estados visuales intermedios (indeterminado).
 *
 * Rendimiento: la identidad de cada item se resuelve una vez y se
 * agrupa en `Set`s (`Set.has` es O(1)), de modo que todas las
 * operaciones de selección son O(n) en vez de O(n²) (`Array.some`
 * anidado). Con datasets de miles de registros, seleccionar todo o
 * filtrar con selección activa pasa de segundos a milisegundos.
 */
export default function useSelect(
    paginatedItems: Ref<TableItem[]> | ComputedRef<TableItem[]>,
    selectedItems: Ref<TableItem[]>,
    filteredItems: Ref<TableItem[]> | ComputedRef<TableItem[]>,
    resolveItemKey: ResolveItemKey,
) {
    /**
     * Agrupa un conjunto de items por identidad: claves resueltas
     * comparables por valor y referencias para los sin clave.
     */
    const buildIdentity = (items: TableItem[]): ItemIdentity => {
        const keySet = new Set<unknown>();
        const refSet = new Set<TableItem>();

        items.forEach((item: TableItem) => {
            const key = resolveItemKey(item, -1);
            if (key !== null) {
                keySet.add(key);
            } else {
                refSet.add(item);
            }
        });

        return { keySet, refSet };
    };

    // Identidad del conjunto seleccionado: se recalcula una sola vez
    // por cambio de selección y consulta O(1) para cada fila.
    const selectedIdentity = computed<ItemIdentity>(() => buildIdentity(selectedItems.value));

    const isSelected = (item: TableItem): boolean => {
        const { keySet, refSet } = selectedIdentity.value;
        const key = resolveItemKey(item, -1);
        if (key !== null) return keySet.has(key);
        return refSet.has(item);
    };

    const mergeUniqueItems = (sourceItems: TableItem[], itemsToAdd: TableItem[]): TableItem[] => {
        // Los items existentes se conservan en el mismo orden; los que
        // comparten identidad ya cubierta (clave o referencia) se descartan.
        const { keySet, refSet } = buildIdentity(sourceItems);
        const nextItems = [...sourceItems];

        itemsToAdd.forEach((item: TableItem) => {
            const key = resolveItemKey(item, -1);
            if (key !== null) {
                if (!keySet.has(key)) {
                    keySet.add(key);
                    nextItems.push(item);
                }
            } else if (!refSet.has(item)) {
                refSet.add(item);
                nextItems.push(item);
            }
        });

        return nextItems;
    };

    const removeItems = (sourceItems: TableItem[], itemsToRemove: TableItem[]): TableItem[] => {
        const { keySet, refSet } = buildIdentity(itemsToRemove);

        return sourceItems.filter((item: TableItem) => {
            const key = resolveItemKey(item, -1);
            if (key !== null) return !keySet.has(key);
            return !refSet.has(item);
        });
    };

    const toggleSelect = (item: TableItem): void => {
        if (isSelected(item)) {
            selectedItems.value = removeItems(selectedItems.value, [item]);
            return;
        }

        selectedItems.value = mergeUniqueItems(selectedItems.value, [item]);
    };

    // Selecciona solo los items visibles en la página actual
    const selectAll = (): void => {
        selectedItems.value = mergeUniqueItems(selectedItems.value, paginatedItems.value);
    };

    const clearSelection = (): void => {
        selectedItems.value = [];
    };

    const clearPageSelection = (): void => {
        selectedItems.value = removeItems(selectedItems.value, paginatedItems.value);
    };

    // Toggle para el checkbox del header
    const toggleSelectAll = (): void => {
        if (allSelected.value) {
            clearPageSelection();
        } else {
            selectAll();
        }
    };

    // Selecciona TODOS los items filtrados (incluso los de otras páginas)
    function selectCompleteAll(): void {
        // Reemplaza la selección por el dataset filtrado, desduplicado
        // por identidad (una sola pasada O(n) en vez de O(n²)).
        const nextKeySet = new Set<unknown>();
        const nextRefSet = new Set<TableItem>();

        selectedItems.value = filteredItems.value.filter((item: TableItem) => {
            const key = resolveItemKey(item, -1);
            if (key !== null) {
                if (nextKeySet.has(key)) return false;
                nextKeySet.add(key);
                return true;
            }
            if (nextRefSet.has(item)) return false;
            nextRefSet.add(item);
            return true;
        });
    }

    // --- Computed States ---

    // Verdadero si TODOS los items de la página actual están seleccionados
    const allSelected = computed(() => {
        return paginatedItems.value?.length > 0 && paginatedItems.value.every(isSelected);
    });

    const allFilteredSelected = computed(() => {
        return filteredItems.value?.length > 0 && filteredItems.value.every(isSelected);
    });

    // Verdadero si hay más items seleccionados que los que se ven en la página actual
    // (Indica que se seleccionó "todo" o items de otras páginas)
    const moreThanPaginated = computed(() => {
        const { keySet, refSet } = buildIdentity(paginatedItems.value);

        return selectedItems.value?.some((selectedItem: TableItem) => {
            const key = resolveItemKey(selectedItem, -1);
            if (key !== null) return !keySet.has(key);
            return !refSet.has(selectedItem);
        });
    });

    // Indeterminado: Hay selección pero no son todos los de la página
    const someSelected = computed(() => {
        return paginatedItems.value?.some(isSelected) && !allSelected.value;
    });

    // Mantiene la selección alineada con el dataset filtrado actual.
    // Watch superficial: `filteredItems` es un computed que produce un
    // array nuevo en cada reevaluación, no hace falta traverse profundo.
    watch(filteredItems, (nextFilteredItems: TableItem[]) => {
        const { keySet } = buildIdentity(nextFilteredItems);

        // Items sin clave resuelta se conservan siempre (igual que antes);
        // con clave se conservan solo si sigue presente en el dataset.
        selectedItems.value = selectedItems.value.filter((selectedItem: TableItem) => {
            const key = resolveItemKey(selectedItem, -1);
            if (key !== null) return keySet.has(key);
            return true;
        });
    });

    return {
        selectedItems,
        isSelected,
        toggleSelect,
        selectAll,
        clearSelection,
        toggleSelectAll,
        allSelected,
        allFilteredSelected,
        someSelected,
        moreThanPaginated,
        selectCompleteAll
    };
}
