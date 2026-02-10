import { ref } from 'vue';

/**
 * Composable simple para gestionar filas expandidas.
 * Mantiene un array de items que están expandidos.
 */
export default function useExpand() {
    const expandedItems = ref([]);

    const isExpanded = (item) => expandedItems.value.includes(item);

    const toggleExpand = (item) => {
        const index = expandedItems.value.indexOf(item);
        if (index === -1) {
            expandedItems.value.push(item);
        } else {
            expandedItems.value.splice(index, 1);
        }
    };

    const expandAll = (items) => {
        expandedItems.value = [...items];
    };

    const collapseAll = () => {
        expandedItems.value = [];
    };

    return {
        expandedItems,
        isExpanded,
        toggleExpand,
        expandAll,
        collapseAll,
    };
}
