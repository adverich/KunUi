import { ref, type Ref } from 'vue';
import type { TableItem } from './useRowKey.js';

/**
 * Composable simple para gestionar filas expandidas.
 * Mantiene un array de items que están expandidos.
 */
export default function useExpand() {
    const expandedItems: Ref<TableItem[]> = ref([]);

    const isExpanded = (item: TableItem): boolean => expandedItems.value.includes(item);

    const toggleExpand = (item: TableItem): void => {
        const index = expandedItems.value.indexOf(item);
        if (index === -1) {
            expandedItems.value.push(item);
        } else {
            expandedItems.value.splice(index, 1);
        }
    };

    const expandAll = (items: TableItem[]): void => {
        expandedItems.value = [...items];
    };

    const collapseAll = (): void => {
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
