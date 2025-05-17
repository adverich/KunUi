import { computed } from 'vue'

export function useSlider(props, emit) {
    // ---- Props ----
    const internalValue = computed({
        get: () => Number(props.modelValue),
        set: (value) => emit('update:modelValue', value)
    })

    // ---- Emits ----
    // Se manejan desde aquí o directamente en el componente, según sea necesario

    // ---- Lógica interna ----
    const thumbPosition = computed(() => {
        const minVal = Number(props.min)
        const maxVal = Number(props.max)
        const value = Number(internalValue.value)

        if (maxVal === minVal) return 0

        const percent = ((value - minVal) / (maxVal - minVal)) * 100
        return `calc(${percent}% - 1rem)`
    })

    return {
        internalValue,
        thumbPosition
    }
}