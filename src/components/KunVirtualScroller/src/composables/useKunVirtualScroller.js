import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { debounce } from '../../../../utils/utils.js'

export function useKunVirtualScroller({
    root,
    items,
    estimatedItemHeight,
    containerHeight = ref(0),
    buffer = 5,
}) {
    const positions = ref([])
    const totalHeight = ref(0)

    const visibleItems = ref({
        items: [],
        totalHeight: 0,
    })

    const effectiveHeight = computed(() =>
        typeof estimatedItemHeight === 'number' && !isNaN(estimatedItemHeight)
            ? estimatedItemHeight
            : 48
    )

    const recompute = () => {
        const list = [...(items.value || [])]

        if (!list.length) {
            positions.value = []
            totalHeight.value = 0
            visibleItems.value = {
                items: [],
                totalHeight: 0,
            }
            return
        }

        let currentTop = 0
        const newPositions = []

        list.forEach((item, index) => {
            newPositions.push({
                index,
                top: currentTop,
                height: effectiveHeight.value,
                raw: item,
            })
            currentTop += effectiveHeight.value
        })

        positions.value = newPositions
        totalHeight.value = currentTop

        updateVisibleItems()
    }

    const updateVisibleItems = () => {
        const el = root.value
        const pos = positions.value
        if (!el || !pos.length) {
            visibleItems.value = {
                items: [],
                totalHeight: totalHeight.value,
            }
            return
        }

        const scrollTop = el.scrollTop
        const viewHeight = containerHeight.value || el.clientHeight
        const bottomLimit = scrollTop + viewHeight

        let startIndex = 0
        while (
            startIndex < pos.length &&
            pos[startIndex].top + pos[startIndex].height <= scrollTop
        ) {
            startIndex++
        }

        let endIndex = startIndex
        while (
            endIndex < pos.length &&
            pos[endIndex].top < bottomLimit
        ) {
            endIndex++
        }

        // Añadir buffer para evitar parpadeos
        startIndex = Math.max(0, startIndex - buffer)
        endIndex = Math.min(pos.length, endIndex + buffer)

        visibleItems.value = {
            items: pos.slice(startIndex, endIndex),
            totalHeight: totalHeight.value,
        }
    }

    const scrollTo = async (index) => {
        const el = root.value
        if (!el) return

        // Esperar que positions se hayan calculado
        await nextTick()

        const pos = positions.value[index]
        if (pos) {
            el.scrollTop = pos.top
        }
    }

    const onScroll = debounce(updateVisibleItems, 16) // ~60fps

    const attachScrollHandler = () => {
        const el = root.value
        if (el) {
            el.addEventListener('scroll', onScroll)
        }
    }

    const detachScrollHandler = () => {
        const el = root.value
        if (el) {
            el.removeEventListener('scroll', onScroll)
        }
    }

    watch(
        () => items.value,
        () => {
            recompute()
        },
        { immediate: true, deep: true }
    )

    watch(containerHeight, () => {
        updateVisibleItems()
    })

    watch(root, (el, _, onCleanup) => {
        if (el) {
            attachScrollHandler()
            onCleanup(() => detachScrollHandler())
        }
    })

    onMounted(() => {
        requestAnimationFrame(() => {
            recompute()
            updateVisibleItems()
            attachScrollHandler()
        })
    })

    onUnmounted(() => {
        detachScrollHandler()
    })

    return {
        visibleItems: computed(() => visibleItems.value),
        scrollTo,
    }
}
