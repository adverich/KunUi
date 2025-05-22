import { computed, ref, watch, nextTick } from 'vue'

export function useKunInfiniteScroll({
    items,
    search,
    searchableKeys = [],
    itemsPerIntersection = 20,
}) {
    const currentBatch = ref(1)
    const scrollToIndex = ref(null)

    const safeSearchableKeys = computed(() =>
        Array.isArray(searchableKeys) ? searchableKeys : []
    )

    const effectiveItemsPerIntersection = computed(() =>
        typeof itemsPerIntersection === 'number' && itemsPerIntersection > 0
            ? itemsPerIntersection
            : 20
    )

    /////////***************************** *//////////////////////////////////
    // MEJORAR EL FILTRADO PORQUE SOLO ESTA BUSCANDO Y FILTRANDO POR STRINGS
    /////////***************************** *//////////////////////////////////
    const filteredItems = computed(() => {
        const list = items.value || []
        const q = search.value?.trim().toLowerCase()
        if (!q || !safeSearchableKeys.value.length) return list

        return list.filter((item) => {
            return safeSearchableKeys.value.some((key) => {
                const val = key.split('.').reduce((obj, k) => obj?.[k], item)
                return typeof val === 'string' && val.toLowerCase().includes(q)
            })
        })
    })

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
