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
            return internalValue.value.some(v =>
                comparator(v, props.value ?? props.trueValue)
            )
        }

        return comparator(internalValue.value, props.value ?? props.trueValue)
    })

    function toggle() {
        if (props.disabled || props.readonly) return

        let newValue

        if (props.indeterminate) {
            newValue = props.value ?? props.trueValue
        } else if (props.multiple && Array.isArray(internalValue.value)) {
            const val = props.value ?? props.trueValue
            const exists = internalValue.value.some(v => comparator(v, val))
            newValue = exists
                ? internalValue.value.filter(v => !comparator(v, val))
                : [...internalValue.value, val]
        } else {
            newValue = isChecked.value
                ? props.falseValue
                : (props.value ?? props.trueValue)
        }

        internalValue.value = newValue
        emit('update:modelValue', newValue)
    }

    return {
        isChecked,
        toggle,
        internalValue,
    }
}
