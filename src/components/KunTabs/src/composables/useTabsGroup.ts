// useTabsGroup.ts
import { ref, watch, nextTick, computed, type Ref, type ComputedRef } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export interface TabsGroupOptions {
    modelValue?: unknown;
    /** Getter reactivo del valor (si se provee, la selección se sincroniza ante cambios externos) */
    getModelValue?: () => unknown;
    emit: (event: 'update:modelValue', value: unknown) => void;
    tabsWrapper: Ref<HTMLElement | null>;
    tabsContainer: Ref<HTMLElement | null>;
    multiple?: boolean;
    mandatory?: boolean;
    centerActive?: boolean;
    direction?: string;
}

export function useTabsGroup(options: TabsGroupOptions) {
    const {
        modelValue,
        getModelValue,
        emit,
        tabsWrapper,
        tabsContainer,
        multiple = false,
        mandatory = false,
        centerActive = false,
        direction = 'horizontal',
    } = options

    const readModelValue = (): unknown => (getModelValue ? getModelValue() : modelValue);

    const activeIndexes: Ref<number[] | number | null> = ref(multiple ? [] : null)
    const tabRefs: Ref<HTMLElement[]> = ref([])
    const route = useRoute()
    const router = useRouter()

    const registerTab = (el: HTMLElement | null): void => {
        if (el && !tabRefs.value.includes(el)) tabRefs.value.push(el)
    }

    const findIndexByValue = (value: unknown): number =>
        tabRefs.value.findIndex((el: HTMLElement) => (el as HTMLElement & { dataset?: DOMStringMap })?.dataset?.value == (value as string))

    const updateSelection = (): void => {
        const current = readModelValue();
        if (multiple) {
            activeIndexes.value = (Array.isArray(current) ? current : []).map(findIndexByValue).filter((i: number) => i >= 0)
        } else {
            const idx = findIndexByValue(current)
            activeIndexes.value = idx >= 0 ? idx : null
            if (centerActive && idx >= 0) scrollToIndex(idx)
        }
    }

    const scrollToIndex = (idx: number): void => {
        nextTick(() => {
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
    }

    const sliderStyle = computed(() => {
        if (multiple || activeIndexes.value == null) return null
        const el = tabRefs.value[activeIndexes.value as number]
        if (!el) return null
        return direction === 'horizontal'
            ? { left: `${el.offsetLeft}px`, width: `${el.offsetWidth}px` }
            : { top: `${el.offsetTop}px`, height: `${el.offsetHeight}px`, width: '2px', left: '0' }
    })

    /** Índice activo en modo simple (alias de activeIndexes para el SFC) */
    const activeIndex: ComputedRef<number | null> = computed(() =>
        multiple ? null : (activeIndexes.value as number | null),
    );

    const showPrev = ref(false), showNext = ref(false)
    const updateScroll = (): void => {
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
    const scrollPrev = (): void => {
        const w = tabsWrapper.value
        if (!w) return
        direction === 'horizontal'
            ? w.scrollBy({ left: -scrollStep, behavior: 'smooth' })
            : w.scrollBy({ top: -scrollStep, behavior: 'smooth' })
        updateScroll()
    }
    const scrollNext = (): void => {
        const w = tabsWrapper.value
        if (!w) return
        direction === 'horizontal'
            ? w.scrollBy({ left: scrollStep, behavior: 'smooth' })
            : w.scrollBy({ top: scrollStep, behavior: 'smooth' })
        updateScroll()
    }

    const select = (value: unknown): void => {
        let newVal: unknown
        const current = readModelValue();
        if (multiple) {
            const arr = Array.isArray(current) ? [...current] : []
            const idx = arr.indexOf(value)
            if (idx >= 0) {
                mandatory && arr.length === 1 ? newVal = arr : arr.splice(idx, 1) && (newVal = arr)
            } else arr.push(value) && (newVal = arr)
        } else {
            newVal = value === current && mandatory ? current : value
            if (centerActive) {
                const idx = findIndexByValue(newVal)
                if (idx >= 0) scrollToIndex(idx)
            }
        }
        emit('update:modelValue', newVal)
    }

    // If route has tab values to sync
    // watch(() => route.fullPath, () => {
    //     if (modelValue !== route.fullPath) emit('update:modelValue', route.fullPath)
    // })

    watch(() => readModelValue(), () => {
        updateSelection()
        nextTick(updateScroll)
    }, { immediate: true })
    watch(tabRefs, () => nextTick(updateScroll), { deep: true })

    return {
        activeIndexes,
        activeIndex,
        sliderStyle,
        registerTab,
        showPrev,
        showNext,
        scrollNext,
        scrollPrev,
        select
    }
}
