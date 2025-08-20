import { computed, ref, watch, nextTick } from 'vue'

export function useKunInfiniteScroll({
    items,
    search,
    searchableKeys = [],
    itemsPerIntersection = 20,
}) {
    const currentBatch = ref(1)
    const scrollToIndex = ref(null)

    const safeSearchableKeys = computed(() => Array.isArray(searchableKeys) ? searchableKeys.filter(k => k != null && k !== '').map(k => String(k)) : []);

    const effectiveItemsPerIntersection = computed(() =>
        typeof itemsPerIntersection === 'number' && itemsPerIntersection > 0
            ? itemsPerIntersection
            : 20
    )

    /////////***************************** *//////////////////////////////////
    // MEJORAR EL FILTRADO PORQUE SOLO ESTA BUSCANDO Y FILTRANDO POR STRINGS
    /////////***************************** *//////////////////////////////////
    const filteredItems = computed(() => {
        const list = items.value || [];
        const q = search.value == null ? '' : String(search.value).trim().toLowerCase();
        if (!q) return list;

        const keys = safeSearchableKeys.value;

        return list.filter(item => {
            if (keys.length > 0) {
                // Buscar solo por las claves indicadas (soporta rutas a.b.c)
                return keys.some(key => {
                    const val = getByPath(item, key);
                    if (val == null) return false;
                    return toStringArray(val, 1).some(s => s.toLowerCase().includes(q));
                });
            }

            // Sin keys: si es primitivo, comparar directo; si es objeto/array, comparar sus valores (shallow)
            return toStringArray(item, 1).some(s => s.toLowerCase().includes(q));
        });
    });

    const isPrimitive = (v) => v === null || (typeof v !== 'object' && typeof v !== 'function');
    const toStringArray = (v, depth = 1) => {
        // depth controla cuán profundo querés ir (1 = shallow). Subilo a 2 si querés un poco de recursión.
        if (v == null) return [];
        if (isPrimitive(v)) return [String(v)];
        if (Array.isArray(v)) {
            return depth <= 0 ? [] : v.flatMap(x => toStringArray(x, depth - 1));
        }
        // objeto plano
        return depth <= 0 ? [] : Object.values(v).flatMap(x => toStringArray(x, depth - 1));
    };
    const getByPath = (obj, path) => {
        if (!path) return undefined;
        return String(path).split('.').reduce((acc, k) => (acc != null ? acc[k] : undefined), obj);
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

    function loadNextBatch() {
        if (!lastBatchReached.value) {
            currentBatch.value++
        }
    }

    function resetCurrentBatchStep() {
        currentBatch.value = 1
    }

    watch(
        () => search.value,
        () => {
            resetCurrentBatchStep()
        },
        { flush: 'pre' }
    )

    async function setScrollToIndex(index) {
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
