// useTabsGroup.js
import { ref, watch, nextTick, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export function useTabsGroup(options) {
    const {
        modelValue,
        emit,
        tabsWrapper,
        tabsContainer,
        multiple = false,
        mandatory = false,
        centerActive = false,
        direction = 'horizontal',
    } = options

    const activeIndexes = ref(multiple ? [] : null)
    const tabRefs = ref([])
    const route = useRoute()
    const router = useRouter()

    const registerTab = el => {
        if (el && !tabRefs.value.includes(el)) tabRefs.value.push(el)
    }

    const findIndexByValue = value =>
        tabRefs.value.findIndex(el => el?.dataset?.value == value)

    const updateSelection = () => {
        if (multiple) {
            activeIndexes.value = (Array.isArray(modelValue) ? modelValue : []).map(findIndexByValue).filter(i => i >= 0)
        } else {
            const idx = findIndexByValue(modelValue)
            activeIndexes.value = idx >= 0 ? idx : null
            if (centerActive && idx >= 0) scrollToIndex(idx)
        }
    }

    const scrollToIndex = idx => nextTick(() => {
        const wrapper = tabsWrapper.value
        const el = tabRefs.value[idx]
        if (wrapper && el) {
            const offset = direction === 'horizontal'
                ? el.offsetLeft + el.offsetWidth / 2 - wrapper.clientWidth / 2
                : el.offsetTop + el.offsetHeight / 2 - wrapper.clientHeight / 2
            direction === 'horizontal'
                ? wrapper.scrollTo({ left: offset, behavior: 'smooth' })
                : wrapper.scrollTo({ top: offset, behavior: 'smooth' })
        }
    })

    const sliderStyle = computed(() => {
        if (multiple || activeIndexes.value == null) return null
        const el = tabRefs.value[activeIndexes.value]
        if (!el) return null
        return direction === 'horizontal'
            ? { left: `${el.offsetLeft}px`, width: `${el.offsetWidth}px` }
            : { top: `${el.offsetTop}px`, height: `${el.offsetHeight}px`, width: '2px', left: '0' }
    })

    const showPrev = ref(false), showNext = ref(false)
    const updateScroll = () => {
        const w = tabsWrapper.value, c = tabsContainer.value
        if (!w || !c) return
        showPrev.value = direction === 'horizontal'
            ? w.scrollLeft > 0
            : w.scrollTop > 0
        showNext.value = direction === 'horizontal'
            ? c.scrollWidth > w.clientWidth + w.scrollLeft
            : c.scrollHeight > w.clientHeight + w.scrollTop
    }
    const scrollStep = 100
    const scrollPrev = () => {
        const w = tabsWrapper.value
        if (!w) return
        direction === 'horizontal'
            ? w.scrollBy({ left: -scrollStep, behavior: 'smooth' })
            : w.scrollBy({ top: -scrollStep, behavior: 'smooth' })
        updateScroll()
    }
    const scrollNext = () => {
        const w = tabsWrapper.value
        if (!w) return
        direction === 'horizontal'
            ? w.scrollBy({ left: scrollStep, behavior: 'smooth' })
            : w.scrollBy({ top: scrollStep, behavior: 'smooth' })
        updateScroll()
    }

    const select = value => {
        let newVal
        if (multiple) {
            const arr = Array.isArray(modelValue) ? [...modelValue] : []
            const idx = arr.indexOf(value)
            if (idx >= 0) {
                mandatory && arr.length === 1 ? newVal = arr : arr.splice(idx, 1) && (newVal = arr)
            } else arr.push(value) && (newVal = arr)
        } else {
            newVal = value === modelValue && mandatory ? modelValue : value
            if (centerActive) {
                const idx = findIndexByValue(newVal)
                if (idx >= 0) scrollToIndex(idx)
            }
        }
        emit('update:modelValue', newVal)
    }

    // If route has tab values to sync
    watch(() => route.fullPath, () => {
        if (modelValue !== route.fullPath) emit('update:modelValue', route.fullPath)
    })

    watch(() => modelValue, () => {
        updateSelection()
        nextTick(updateScroll)
    }, { immediate: true })
    watch(tabRefs, () => nextTick(updateScroll), { deep: true })

    return {
        activeIndexes,
        sliderStyle,
        registerTab,
        showPrev,
        showNext,
        scrollNext,
        scrollPrev,
        select
    }
}
