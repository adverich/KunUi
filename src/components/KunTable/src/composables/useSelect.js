import { computed, watch } from 'vue';

/**
 * Composable para manejo de selección de filas.
 * Soporta:
 * - Selección individual (toggle).
 * - Selección de página completa.
 * - Selección de TODO el dataset (incluso lo no visible).
 * - Estados visuales intermedios (indeterminado).
 */
export default function useSelect(paginatedItems, selectedItems, filteredItems) {
    const isSelected = (item) => selectedItems.value.includes(item);

    const toggleSelect = (item) => {
        const index = selectedItems.value.indexOf(item);
        if (index === -1) {
            // selectedItems.value.push(item);
            selectedItems.value = [...selectedItems.value, item];
        } else {
            // selectedItems.value.splice(index, 1);
            selectedItems.value = selectedItems.value.filter(i => i.id !== item.id);
        }
        // emits?.('update:selectedItems', selectedItems.value);
    };

    // Selecciona solo los items visibles en la página actual
    const selectAll = () => {
        selectedItems.value = [...paginatedItems.value];
    };

    const clearSelection = () => {
        selectedItems.value = [];
    };

    // Toggle para el checkbox del header
    const toggleSelectAll = () => {
        if (allSelected.value) {
            clearSelection();
        } else {
            selectAll();
        }
    };

    // Selecciona TODOS los items filtrados (incluso los de otras páginas)
    function selectCompleteAll() {
        selectedItems.value = [...filteredItems.value];
    }

    // --- Computed States ---

    // Verdadero si TODOS los items de la página actual están seleccionados
    const allSelected = computed(() => {
        return paginatedItems.value?.length > 0 && selectedItems.value.length === paginatedItems.value.length;
    });

    // Verdadero si hay más items seleccionados que los que se ven en la página actual
    // (Indica que se seleccionó "todo" o items de otras páginas)
    const moreThanPaginated = computed(() => {
        return selectedItems.value?.length > paginatedItems.value?.length;
    });

    // Indeterminado: Hay selección pero no son todos los de la página
    const someSelected = computed(() => {
        return paginatedItems.value?.length > 0 && selectedItems.value.length > 0 && selectedItems.value.length < paginatedItems.value.length;
    });

    // Resetear selección si cambian los items mostrados (opcional, behavior configurable)
    watch(() => paginatedItems, (newVal, oldVal) => {
        if (newVal !== oldVal) clearSelection();
    }, { deep: true });

    return {
        selectedItems,
        isSelected,
        toggleSelect,
        selectAll,
        clearSelection,
        toggleSelectAll,
        allSelected,
        someSelected,
        moreThanPaginated,
        selectCompleteAll
    };
}