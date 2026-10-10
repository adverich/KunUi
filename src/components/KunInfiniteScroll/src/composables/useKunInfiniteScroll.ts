import { computed, ref, watch, nextTick, type Ref } from 'vue'

export interface KunInfiniteScrollOptions {
    items: Ref<unknown[]>;
    search: Ref<unknown>;
    searchableKeys?: unknown;
    itemsPerIntersection?: unknown;
}

export function useKunInfiniteScroll({
    items,
    search,
    searchableKeys = [],
    itemsPerIntersection = 20,
}: KunInfiniteScrollOptions) {
    const currentBatch = ref(1)
    const scrollToIndex: Ref<number | null> = ref(null)

    const safeSearchableKeys = computed(() => Array.isArray(searchableKeys) ? (searchableKeys as unknown[]).filter((k: unknown) => k != null && k !== '').map((k: unknown) => String(k)) : []);

    const effectiveItemsPerIntersection = computed(() =>
        typeof itemsPerIntersection === 'number' && itemsPerIntersection > 0
            ? itemsPerIntersection
            : 20
    )

    const filteredItems = computed(() => {
        const list = items.value || [];
        const terms = search.value == null
            ? []
            : String(search.value).trim().toLowerCase().split(/\s+/).filter(Boolean);

        if (terms.length === 0) return list;

        const keys = safeSearchableKeys.value;

        return list.filter((item: unknown) => {
            let values: string[];

            if (keys.length > 0) {
                // Buscar solo por las claves indicadas (soporta rutas a.b.c).
                values = keys.flatMap((key: string) => toStringArray(getByPath(item, key), 1));
            } else {
                // Sin keys: si es primitivo, comparar directo; si es objeto/array, comparar sus valores (shallow).
                values = toStringArray(item, 1);
            }

            const normalizedValues = values.map((value: string) => value.toLowerCase());

            // Cada término debe aparecer en alguno de los valores; pueden coincidir
            // en claves diferentes y en cualquier orden.
            return terms.every((term: string) => normalizedValues.some((value: string) => value.includes(term)));
        });
    });

    const isPrimitive = (v: unknown): boolean => v === null || (typeof v !== 'object' && typeof v !== 'function');
    const toStringArray = (v: unknown, depth = 1): string[] => {
        // depth controla cuán profundo querés ir (1 = shallow). Subilo a 2 si querés un poco de recursión.
        if (v == null) return [];
        if (isPrimitive(v)) return [String(v)];
        if (Array.isArray(v)) {
            return depth <= 0 ? [] : (v as unknown[]).flatMap((x: unknown) => toStringArray(x, depth - 1));
        }
        // objeto plano
        return depth <= 0 ? [] : Object.values(v as Record<string, unknown>).flatMap((x: unknown) => toStringArray(x, depth - 1));
    };
    const getByPath = (obj: unknown, path: unknown): unknown => {
        if (!path) return undefined;
        return String(path).split('.').reduce((acc: unknown, k: string) => (acc != null ? (acc as Record<string, unknown>)[k] : undefined), obj);
    };


    const totalItems = computed(() => filteredItems.value.length)

    const visibleItems = computed(() =>
        filteredItems.value.slice(
            0,
            currentBatch.value * effectiveItemsPerIntersection.value
        )
    )

    const lastBatchReached = computed(
        () => visibleItems.value.length >= filteredItems.value.length
    )

    const isFirstBatch = computed(() => currentBatch.value === 1)

    function loadNextBatch(): void {
        if (!lastBatchReached.value) {
            currentBatch.value++
        }
    }

    function resetCurrentBatchStep(): void {
        currentBatch.value = 1
    }

    watch(
        () => search.value,
        () => {
            resetCurrentBatchStep()
        },
        { flush: 'pre' }
    )

    async function setScrollToIndex(index: unknown): Promise<void> {
        if (typeof index !== 'number' || index < 0) return
        scrollToIndex.value = index

        // Limitar index a max índice posible
        const maxIndex = filteredItems.value.length - 1
        const targetIndex = Math.min(index, maxIndex)

        while (
            targetIndex >= visibleItems.value.length &&
            !lastBatchReached.value
        ) {
            loadNextBatch()
            await nextTick()
        }
    }

    return {
        visibleItems,
        loadNextBatch,
        resetCurrentBatchStep,
        lastBatchReached,
        isFirstBatch,
        totalItems,
        setScrollToIndex,
        scrollToIndex, // opcional, si lo necesitás desde el componente padre
    }
}
