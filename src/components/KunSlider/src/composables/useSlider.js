import { computed } from 'vue'

export function useSlider(props, emit, trackRef) {
    const val = computed({
        get: () => (props.range ? [...props.modelValue] : Number(props.modelValue)),
        set: (v) => emit('update:modelValue', props.range ? v : v[0])
    })

    const tickCount = computed(() => {
        const min = Number(props.min)
        const max = Number(props.max)
        const step = Number(props.step)
        return step > 0 ? Math.floor((max - min) / step) + 1 : 0
    })

    const percentage = (value) => {
        const min = Number(props.min)
        const max = Number(props.max)
        return ((value - min) / (max - min)) * 97
    }

    const thumbStyles = computed(() => {
        const values = props.range ? val.value : [val.value]
        return values.map((v) => ({
            [props.vertical ? 'bottom' : 'left']: `${percentage(v)}%`
        }))
    })

    const trackFillStyle = computed(() => {
        const values = props.range ? val.value : [val.value]
        const minPercent = `${percentage(Math.min(...values))}%`
        const maxPercent = `${percentage(Math.max(...values))}%`

        return props.vertical
            ? { bottom: minPercent, top: `calc(100% - ${maxPercent})` }
            : { left: minPercent, right: `calc(100% - ${maxPercent})` }
    })

    function updateValue(v) {
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
