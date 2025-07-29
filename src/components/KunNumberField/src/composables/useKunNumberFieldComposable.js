import { ref, computed, watch, inject, onUnmounted } from 'vue'
import { debounce } from '@/utils/utils'
import { parseNumber, normalizeNumber, formatNumber } from './numberFormatUtils'

export default function useKunNumberField(props, emits) {
    const rawInput = ref(formatNumber(props.modelValue, props.separator, props.precision))
    const inputValue = ref(props.modelValue) // número real
    const inputFocused = ref(false)
    const validationError = ref('')
    const isTouched = ref(false)
    const inputField = ref(null)
    const rootRef = ref(null)
    const syncing = ref(false)

    const registerField = inject('registerField', null)
    const unregisterField = inject('unregisterField', null)

    const hasError = computed(() => props.error || (!!validationError.value && isTouched.value))

    const runValidations = async () => {
        for (const rule of props.rules) {
            const result = await Promise.resolve(rule(inputValue.value))
            if (result !== true) return result
        }
        return true
    }

    const debouncedValidate = debounce(async () => {
        const result = await runValidations()
        validationError.value = result === true ? '' : result
    }, props.debounce ?? 300)

    // v-model externo => actualiza el modelo interno
    watch(() => props.modelValue, (newVal) => {
        if (newVal !== inputValue.value) {
            syncing.value = true
            inputValue.value = newVal
            rawInput.value = formatNumber(newVal, props.separator, props.precision)
        }
    })

    // input de usuario
    function handleInput(e) {
        const val = normalizeNumber(e.target.value, props.separator)
        rawInput.value = val

        const num = parseNumber(val, props.separator)
        if (!isNaN(num)) {
            inputValue.value = num
            emits('update:modelValue', num)
            if (!props.validateOnBlur) debouncedValidate()
        }
    }

    function handleBlur() {
        inputFocused.value = false
        rawInput.value = formatNumber(inputValue.value, props.separator, props.precision)
        if (props.validateOnBlur) validate()
        emits('blur')
    }

    function focusInput() {
        inputFocused.value = true
        emits('focus')
    }

    function clearInput() {
        rawInput.value = ''
        inputValue.value = null
        emits('update:modelValue', null)
        isTouched.value = true
        if (!props.validateOnBlur) debouncedValidate()
    }

    function onIncrement() {
        let number = inputValue.value || 0
        number += Number(props.step)
        inputValue.value = number
        rawInput.value = formatNumber(number, props.separator, props.precision)
        emits('update:modelValue', number)
    }

    function onDecrement() {
        let number = inputValue.value || 0
        number -= Number(props.step)
        inputValue.value = number
        rawInput.value = formatNumber(number, props.separator, props.precision)
        emits('update:modelValue', number)
    }

    async function validate() {
        isTouched.value = true
        const result = await runValidations()
        validationError.value = result === true ? '' : result
        return result === true
    }

    function reset() {
        inputValue.value = props.modelValue
        rawInput.value = formatNumber(props.modelValue, props.separator, props.precision)
        isTouched.value = false
        validationError.value = ''
    }

    function resetValidation() {
        isTouched.value = false
        validationError.value = ''
    }

    if (registerField) registerField({ validate })
    onUnmounted(() => {
        if (unregisterField) unregisterField({ validate })
    })

    return {
        rawInput,
        inputValue,
        inputField,
        rootRef,
        inputFocused,
        validationError,
        hasError,
        handleInput,
        handleBlur,
        focusInput,
        clearInput,
        onIncrement,
        onDecrement,
        validate,
        reset,
        resetValidation
    }
}
