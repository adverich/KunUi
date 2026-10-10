import { computed, watch, type Ref, type ComputedRef } from 'vue';
import type { TableItem } from './useRowKey.js';

export type ResolveItemKey = (item: TableItem, index?: number) => unknown;

/**
 * Composable para manejo de selección de filas.
 * Soporta:
 * - Selección individual (toggle).
 * - Selección de página completa.
 * - Selección de TODO el dataset (incluso lo no visible).
 * - Estados visuales intermedios (indeterminado).
 */
export default function useSelect(
    paginatedItems: Ref<TableItem[]> | ComputedRef<TableItem[]>,
    selectedItems: Ref<TableItem[]>,
    filteredItems: Ref<TableItem[]> | ComputedRef<TableItem[]>,
    resolveItemKey: ResolveItemKey,
) {
    const hasResolvedKey = (item: TableItem, index = -1): boolean => {
        return resolveItemKey(item, index) !== null;
    };

    const isSameItem = (leftItem: TableItem, rightItem: TableItem, leftIndex = -1, rightIndex = -1): boolean => {
        const leftKey = resolveItemKey(leftItem, leftIndex);
        const rightKey = resolveItemKey(rightItem, rightIndex);

        if (leftKey !== null && rightKey !== null) {
            return leftKey === rightKey;
        }

        return leftItem === rightItem;
    };

    const mergeUniqueItems = (sourceItems: TableItem[], itemsToAdd: TableItem[]): TableItem[] => {
        const nextItems = [...sourceItems];

        itemsToAdd.forEach((item: TableItem, index: number) => {
            if (!nextItems.some((selectedItem: TableItem, selectedIndex: number) => isSameItem(selectedItem, item, selectedIndex, index))) {
                nextItems.push(item);
            }
        });

        return nextItems;
    };

    const removeItems = (sourceItems: TableItem[], itemsToRemove: TableItem[]): TableItem[] => {
        return sourceItems.filter((selectedItem: TableItem, selectedIndex: number) => {
            return !itemsToRemove.some((item: TableItem, index: number) => isSameItem(selectedItem, item, selectedIndex, index));
        });
    };

    const isSelected = (item: TableItem): boolean => selectedItems.value.some((selectedItem: TableItem, selectedIndex: number) => {
        return isSameItem(selectedItem, item, selectedIndex);
    });

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
        selectedItems.value = mergeUniqueItems([], filteredItems.value);
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
        return selectedItems.value?.some((selectedItem: TableItem, selectedIndex: number) => {
            return !paginatedItems.value?.some((pageItem: TableItem, pageIndex: number) => isSameItem(selectedItem, pageItem, selectedIndex, pageIndex));
        });
    });

    // Indeterminado: Hay selección pero no son todos los de la página
    const someSelected = computed(() => {
        return paginatedItems.value?.some(isSelected) && !allSelected.value;
    });

    // Mantiene la selección alineada con el dataset filtrado actual.
    watch(filteredItems, (nextFilteredItems: TableItem[]) => {
        selectedItems.value = selectedItems.value.filter((selectedItem: TableItem, selectedIndex: number) => {
            if (!hasResolvedKey(selectedItem, selectedIndex)) return true;

            return nextFilteredItems.some((item: TableItem, index: number) => isSameItem(selectedItem, item, selectedIndex, index));
        });
    }, { deep: true });

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
