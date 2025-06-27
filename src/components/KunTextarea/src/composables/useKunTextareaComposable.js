import { ref, watch, computed, onMounted, nextTick } from 'vue'

export function useKunTextarea(props, emit, textareaRef) {
    const isFocused = ref(false)
    const rawModelValue = ref(props.modelValue)

    const formatInputValue = (v) => {
        if (props.formatModel === 'raw') return String(v ?? '')
        if (props.formatModel === 'json' || props.formatModel === 'auto') {
            if (typeof v === 'object' && v !== null) {
                try {
                    return JSON.stringify(v, null, 2)
                } catch (e) {
                    return String(v)
                }
            }
        }
        return String(v ?? '')
    }

    const parseTextareaValue = (text) => {
        if (props.formatModel === 'raw') return text

        try {
            const parsed = JSON.parse(text)
            if (props.formatModel === 'json' || props.formatModel === 'auto') {
                return parsed
            }
        } catch (e) {
            // si no es parseable y estamos en auto, devolver string
        }

        return text
    }

    const internalValue = ref(formatInputValue(props.modelValue))

    watch(() => props.modelValue, (val) => {
        rawModelValue.value = val
        internalValue.value = formatInputValue(val)
        if (props.autoGrow) nextTick(adjustHeight)
    })

    const updateValue = (v) => {
        internalValue.value = v
        const parsed = parseTextareaValue(v)
        emit('update:modelValue', parsed)
    }

    const handleClear = () => {
        updateValue('')
        emit('click:clear')
    }

    const adjustHeight = () => {
        if (!textareaRef.value) return
        textareaRef.value.style.height = 'auto'
        textareaRef.value.style.overflowY = 'hidden'

        const scrollHeight = textareaRef.value.scrollHeight
        const lineHeight = parseFloat(getComputedStyle(textareaRef.value).lineHeight || '24')
        const maxRows = Number(props.maxRows || 0)

        if (props.maxRows && maxRows > 0) {
            const maxHeight = maxRows * lineHeight
            textareaRef.value.style.height = Math.min(scrollHeight, maxHeight) + 'px'
        } else {
            textareaRef.value.style.height = scrollHeight + 'px'
        }
    }

    onMounted(() => {
        if (props.autoGrow) nextTick(adjustHeight)
    })

    // Validación (igual)
    const validationErrors = ref([])
    const isPristine = ref(true)

    const validate = (silent = false) => {
        const value = props.validationValue ?? parseTextareaValue(internalValue.value)
        const rules = props.rules ?? []
        const errors = []

        for (const rule of rules) {
            const result = typeof rule === 'function' ? rule(value) : rule
            if (typeof result === 'string') errors.push(result)
            else if (result === false) errors.push('Campo inválido')
        }

        validationErrors.value = errors.slice(0, props.maxErrors ?? 1)
        if (!silent) emit('update:focused', isFocused.value)
        return validationErrors.value
    }

    const resetValidation = () => {
        validationErrors.value = []
    }

    const reset = () => {
        internalValue.value = ''
        resetValidation()
        emit('update:modelValue', '')
    }

    const hasError = computed(() => {
        return props.error || validationErrors.value.length > 0
    })

    const displayedMessages = computed(() => {
        if (props.errorMessages?.length) {
            return Array.isArray(props.errorMessages)
                ? props.errorMessages
                : [props.errorMessages]
        }
        return validationErrors.value
    })

    return {
        isFocused,
        internalValue,
        updateValue,
        handleClear,
        adjustHeight,

        isPristine,
        validate,
        reset,
        resetValidation,
        validationErrors,
        hasError,
        displayedMessages,
    }
}
