import { ref, computed, watch } from 'vue'

export function useCheckboxModel(props, emit) {
    const internalValue = ref(props.modelValue)

    watch(() => props.modelValue, val => {
        internalValue.value = val
    })

    const comparator = props.valueComparator || ((a, b) => a === b)
    const checkedValue = props.value ?? props.trueValue

    const isChecked = computed(() => {
        if (props.indeterminate) return false
        if (props.multiple && Array.isArray(internalValue.value)) {
            return internalValue.value.some(v => comparator(v, checkedValue))
        }
        return comparator(internalValue.value, checkedValue)
    })

    function toggle() {
        if (props.disabled || props.readonly) return

        let newValue
        if (props.indeterminate) {
            newValue = checkedValue
        } else if (props.multiple && Array.isArray(internalValue.value)) {
            const exists = internalValue.value.some(v => comparator(v, checkedValue))
            newValue = exists
                ? internalValue.value.filter(v => !comparator(v, checkedValue))
                : [...internalValue.value, checkedValue]
        } else {
            newValue = isChecked.value ? props.falseValue : checkedValue
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
