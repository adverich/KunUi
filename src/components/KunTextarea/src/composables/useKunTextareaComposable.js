import { ref, watch, computed, onMounted, nextTick } from 'vue'

export function useKunTextarea(props, emit, textareaRef) {
    const isFocused = ref(false)
    const internalValue = ref(props.modelValue ?? '')

    watch(() => props.modelValue, v => {
        internalValue.value = v ?? ''
        if (props.autoGrow) nextTick(adjustHeight)
    })

    const updateValue = (v) => {
        internalValue.value = v
        emit('update:modelValue', v)
    }

    const handleClear = () => {
        updateValue('')
        emit('click:clear')
    }

    const adjustHeight = () => {
        if (!textareaRef.value) return
        const el = textareaRef.value
        el.style.height = 'auto'
        el.style.overflowY = 'hidden'

        const scrollHeight = el.scrollHeight
        const lineHeightStr = getComputedStyle(el).lineHeight
        const lineHeight = parseFloat(lineHeightStr) || 24
        const maxRows = Number(props.maxRows || 0)

        if (props.maxRows && maxRows > 0) {
            const maxHeight = maxRows * lineHeight
            el.style.height = Math.min(scrollHeight, maxHeight) + 'px'
        } else {
            el.style.height = scrollHeight + 'px'
        }
    }

    onMounted(() => {
        if (props.autoGrow) nextTick(adjustHeight)
    })

    // Validación
    const validationErrors = ref([])
    const isPristine = ref(true)

    const validate = (silent = false) => {
        const value = props.validationValue ?? internalValue.value
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

        // validación
        isPristine,
        validate,
        reset,
        resetValidation,
        validationErrors,
        hasError,
        displayedMessages,
    }
}
