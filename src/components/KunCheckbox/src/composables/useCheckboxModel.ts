import { ref, computed, watch, type Ref, type ComputedRef } from 'vue'

export type ValueComparator = (a: unknown, b: unknown) => boolean;

interface CheckboxModelProps {
    modelValue?: unknown;
    value?: unknown;
    trueValue?: unknown;
    falseValue?: unknown;
    multiple?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    valueComparator?: ValueComparator | Function;
}

type CheckboxEmit = (event: 'update:modelValue', value: unknown) => void;

export function useCheckboxModel(props: CheckboxModelProps, emit: CheckboxEmit) {
    const internalValue: Ref<unknown> = ref(props.modelValue)

    watch(() => props.modelValue, (val: unknown) => {
        internalValue.value = val
    })

    const comparator: ValueComparator = (props.valueComparator as ValueComparator | undefined) || ((a: unknown, b: unknown) => a === b)

    const isChecked: ComputedRef<boolean> = computed(() => {
        if (props.indeterminate) return false

        if (props.multiple && Array.isArray(internalValue.value)) {
            return (internalValue.value as unknown[]).some((v: unknown) =>
                comparator(v, props.value ?? props.trueValue)
            )
        }

        return comparator(internalValue.value, props.value ?? props.trueValue)
    })

    function toggle(): void {
        if (props.disabled || props.readonly) return

        let newValue: unknown

        if (props.indeterminate) {
            newValue = props.value ?? props.trueValue
        } else if (props.multiple && Array.isArray(internalValue.value)) {
            const val = props.value ?? props.trueValue
            const arr = internalValue.value as unknown[]
            const exists = arr.some((v: unknown) => comparator(v, val))
            newValue = exists
                ? arr.filter((v: unknown) => !comparator(v, val))
                : [...arr, val]
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
