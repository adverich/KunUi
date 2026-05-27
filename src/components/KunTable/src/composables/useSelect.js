import { computed, watch } from 'vue';

/**
 * Composable para manejo de selección de filas.
 * Soporta:
 * - Selección individual (toggle).
 * - Selección de página completa.
 * - Selección de TODO el dataset (incluso lo no visible).
 * - Estados visuales intermedios (indeterminado).
 */
export default function useSelect(paginatedItems, selectedItems, filteredItems, resolveItemKey) {
    const hasResolvedKey = (item, index = -1) => {
        return resolveItemKey(item, index) !== null;
    };

    const isSameItem = (leftItem, rightItem, leftIndex = -1, rightIndex = -1) => {
        const leftKey = resolveItemKey(leftItem, leftIndex);
        const rightKey = resolveItemKey(rightItem, rightIndex);

        if (leftKey !== null && rightKey !== null) {
            return leftKey === rightKey;
        }

        return leftItem === rightItem;
    };

    const mergeUniqueItems = (sourceItems, itemsToAdd) => {
        const nextItems = [...sourceItems];

        itemsToAdd.forEach((item, index) => {
            if (!nextItems.some((selectedItem, selectedIndex) => isSameItem(selectedItem, item, selectedIndex, index))) {
                nextItems.push(item);
            }
        });

        return nextItems;
    };

    const removeItems = (sourceItems, itemsToRemove) => {
        return sourceItems.filter((selectedItem, selectedIndex) => {
            return !itemsToRemove.some((item, index) => isSameItem(selectedItem, item, selectedIndex, index));
        });
    };

    const isSelected = (item) => selectedItems.value.some((selectedItem, selectedIndex) => {
        return isSameItem(selectedItem, item, selectedIndex);
    });

    const toggleSelect = (item) => {
        if (isSelected(item)) {
            selectedItems.value = removeItems(selectedItems.value, [item]);
            return;
        }

        selectedItems.value = mergeUniqueItems(selectedItems.value, [item]);
    };

    // Selecciona solo los items visibles en la página actual
    const selectAll = () => {
        selectedItems.value = mergeUniqueItems(selectedItems.value, paginatedItems.value);
    };

    const clearSelection = () => {
        selectedItems.value = [];
    };

    const clearPageSelection = () => {
        selectedItems.value = removeItems(selectedItems.value, paginatedItems.value);
    };

    // Toggle para el checkbox del header
    const toggleSelectAll = () => {
        if (allSelected.value) {
            clearPageSelection();
        } else {
            selectAll();
        }
    };

    // Selecciona TODOS los items filtrados (incluso los de otras páginas)
    function selectCompleteAll() {
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
        return selectedItems.value?.some((selectedItem, selectedIndex) => {
            return !paginatedItems.value?.some((pageItem, pageIndex) => isSameItem(selectedItem, pageItem, selectedIndex, pageIndex));
        });
    });

    // Indeterminado: Hay selección pero no son todos los de la página
    const someSelected = computed(() => {
        return paginatedItems.value?.some(isSelected) && !allSelected.value;
    });

    // Mantiene la selección alineada con el dataset filtrado actual.
    watch(filteredItems, (nextFilteredItems) => {
        selectedItems.value = selectedItems.value.filter((selectedItem, selectedIndex) => {
            if (!hasResolvedKey(selectedItem, selectedIndex)) return true;

            return nextFilteredItems.some((item, index) => isSameItem(selectedItem, item, selectedIndex, index));
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
