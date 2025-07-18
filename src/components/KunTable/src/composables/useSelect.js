import { ref, computed, watch } from 'vue';

export default function useSelect(paginatedItems, selectedItems) {
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

    const selectAll = () => {
        selectedItems.value = [...paginatedItems.value];
        // emits?.('update:selectedItems', selectedItems.value);
    };

    const clearSelection = () => {
        selectedItems.value = [];
        // emits?.('update:selectedItems', selectedItems.value);
    };

    const toggleSelectAll = () => {
        if (allSelected.value) {
            clearSelection();
        } else {
            selectAll();
        }
    };

    const allSelected = computed(() => {
        return paginatedItems.value?.length > 0 && selectedItems.value.length === paginatedItems.value.length;
    });

    const someSelected = computed(() => {
        return paginatedItems.value?.length > 0 && selectedItems.value.length > 0 && selectedItems.value.length < paginatedItems.value.length;
    });

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
        someSelected
    };
}