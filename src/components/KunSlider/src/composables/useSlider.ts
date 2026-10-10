import { computed, watch, type Ref } from 'vue'

export interface KunSliderPropsLike {
    modelValue?: number | unknown[];
    range?: boolean;
    min?: unknown;
    max?: unknown;
    step?: unknown;
    vertical?: boolean;
    disabled?: boolean;
}

export type KunSliderEmit = (event: 'update:modelValue', value: number | number[]) => void;

export function useSlider(props: KunSliderPropsLike, emit: KunSliderEmit, trackRef: Ref<HTMLElement | null>) {
    const val = computed<number | number[]>({
        get: () => (props.range ? [...(props.modelValue as number[])] : Number(props.modelValue)),
        set: (v: number | number[]) => emit('update:modelValue', props.range ? v : (v as number[])[0])
    })

    watch(
        () => [props.min, props.max, props.modelValue],
        () => {
            const min = Number(props.min)
            const max = Number(props.max)

            if (props.range) {
                const normalized = (props.modelValue as number[]).map((v: number) => Math.min(max, Math.max(min, v)))
                if (JSON.stringify(normalized) !== JSON.stringify(props.modelValue)) {
                    emit('update:modelValue', normalized)
                }
            } else {
                const value = Math.min(max, Math.max(min, Number(props.modelValue)))
                if (value !== Number(props.modelValue)) {
                    emit('update:modelValue', value)
                }
            }
        },
        { immediate: true }
    )

    const tickCount = computed(() => {
        const min = Number(props.min)
        const max = Number(props.max)
        const step = Number(props.step)
        return step > 0 ? Math.floor((max - min) / step) + 1 : 0
    })

    const percentage = (value: number): number => {
        const min = Number(props.min)
        const max = Number(props.max)
        return ((value - min) / (max - min)) * 97
    }

    const thumbStyles = computed(() => {
        const values = props.range ? (val.value as number[]) : [val.value as number]
        return values.map((v: number) => ({
            [props.vertical ? 'bottom' : 'left']: `${percentage(v)}%`
        }))
    })

    const trackFillStyle = computed(() => {
        const values = props.range ? (val.value as number[]) : [val.value as number]
        const minPercent = `${percentage(Math.min(...values))}%`
        const maxPercent = `${percentage(Math.max(...values))}%`

        return props.vertical
            ? { bottom: minPercent, top: `calc(100% - ${maxPercent})` }
            : { left: minPercent, right: `calc(100% - ${maxPercent})` }
    })

    function updateValue(v: number | number[]): void {
        emit('update:modelValue', v)
    }

    return {
        val,
        updateValue,
        thumbStyles,
        trackFillStyle,
        tickCount
    }
}
