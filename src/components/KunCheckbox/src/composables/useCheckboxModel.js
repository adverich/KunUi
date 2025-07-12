import { ref, computed, watch } from 'vue'

export function useCheckboxModel(props, emit) {
    const internalValue = ref(props.modelValue)

    watch(() => props.modelValue, val => {
        internalValue.value = val
    })

    const comparator = props.valueComparator || ((a, b) => a === b)

    const isChecked = computed(() => {
        if (props.indeterminate) return false
        if (props.multiple && Array.isArray(internalValue.value)) {
            return internalValue.value.some(v => comparator(v, props.value ?? props.trueValue))
        }
        return comparator(internalValue.value, props.value ?? props.trueValue)
    })

    function toggle() {
        if (props.disabled || props.readonly) return

        let newValue
        const current = props.value ?? props.trueValue

        if (props.indeterminate) {
            newValue = current
        } else if (props.multiple && Array.isArray(internalValue.value)) {
            const exists = internalValue.value.some(v => comparator(v, current))
            newValue = exists
                ? internalValue.value.filter(v => !comparator(v, current))
                : [...internalValue.value, current]
        } else {
            newValue = isChecked.value ? props.falseValue : current
        }

        internalValue.value = newValue
        emit('update:modelValue', newValue)
    }

    return {
        isChecked,
        toggle,
        internalValue
    }
}
