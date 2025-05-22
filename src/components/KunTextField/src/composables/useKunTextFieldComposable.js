import { ref, computed, watch, inject, onUnmounted } from 'vue'
import { debounce } from '../../../../utils/utils.js'

export default function useKunTextField(props, emits) {
    const inputValue = ref(props.modelValue)
    const inputFocused = ref(false)
    const validationError = ref('')
    const isTouched = ref(false)
    const inputField = ref(null)
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

    // Sincroniza valor externo con inputValue interno
    watch(() => props.modelValue, (newVal) => {
        if (newVal !== inputValue.value) {
            syncing.value = true
            inputValue.value = newVal
        }
    })

    // Reacciona a cambios en inputValue
    watch(inputValue, () => {
        if (syncing.value) {
            syncing.value = false
            return
        }

        isTouched.value = true
        emits('update:modelValue', inputValue.value)
        if (!props.validateOnBlur) debouncedValidate()
    })

    const handleInput = (e) => {
        inputValue.value = e.target.value
    }

    const handleBlur = async () => {
        inputFocused.value = false
        emits('blurInput')

        if (props.validateOnBlur) {
            const result = await runValidations()
            validationError.value = result === true ? '' : result
        }
    }

    const focusInput = () => {
        inputFocused.value = true
        emits('focusInput')
    }

    const clearInput = () => {
        inputValue.value = ''
        emits('update:modelValue', '')
        isTouched.value = true
        if (!props.validateOnBlur) debouncedValidate()
    }

    const validate = async () => {
        isTouched.value = true
        const result = await runValidations()
        validationError.value = result === true ? '' : result
        return result === true
    }

    const reset = () => {
        inputValue.value = props.modelValue
        isTouched.value = false
        validationError.value = ''
    }

    const resetValidation = () => {
        isTouched.value = false
        validationError.value = ''
    }

    if (registerField) registerField({ validate })
    onUnmounted(() => {
        if (unregisterField) unregisterField({ validate })
    })

    return {
        inputField,
        inputValue,
        inputFocused,
        validationError,
        hasError,
        handleInput,
        handleBlur,
        focusInput,
        validate,
        reset,
        resetValidation,
        clearInput
    }
}
