import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'

export default function useTextarea(props, emit) {
    const inputRef = ref(null)
    const internalValue = ref('')
    const rawModelValue = ref(props.modelValue)
    const isFocused = ref(false)
    const errorMessages = ref([])
    const resizeTimeout = ref(null)

    // -------- FORMATO ----------
    const isJsonMode = computed(() => {
        return props.formatModel === 'json' || (props.formatModel === 'auto' && typeof props.modelValue === 'object')
    })

    function formatInputValue(val) {
        if (isJsonMode.value && val != null) {
            try {
                return JSON.stringify(val, null, 2)
            } catch (e) {
                return ''
            }
        }
        return val ?? ''
    }

    function parseInputValue(val) {
        if (isJsonMode.value && typeof val === 'string') {
            try {
                return JSON.parse(val)
            } catch (e) {
                return null
            }
        }
        return val
    }

    function updateModel(val) {
        const parsed = parseInputValue(val)
        rawModelValue.value = parsed
        emit('update:modelValue', parsed)
        emit('change', parsed)
    }

    // -------- WATCH PRINCIPAL ----------
    watch(() => props.modelValue, (val) => {
        const incoming = JSON.stringify(val)
        const current = JSON.stringify(rawModelValue.value)

        if (incoming !== current) {
            rawModelValue.value = val
            internalValue.value = formatInputValue(val)
            if (props.autoGrow) nextTick(adjustHeight)
        }
    })

    // -------- CRECIMIENTO AUTOMATICO ----------
    function adjustHeight() {
        const input = inputRef.value
        if (!input || !props.autoGrow) return

        nextTick(() => {
            input.style.height = 'auto'  // reset para que calcule scrollHeight correcto

            const maxHeight = props.maxHeight || 9999

            // scrollHeight es la altura necesaria para todo el contenido
            const scrollHeight = input.scrollHeight

            // Ajustamos altura pero nunca más que maxHeight
            input.style.height = `${Math.min(scrollHeight, maxHeight)}px`

            // Mantener posición cursor
            const cursor = input.selectionStart
            input.setSelectionRange(cursor, cursor)
        })
    }


    onMounted(() => {
        internalValue.value = formatInputValue(props.modelValue)
        nextTick(() => {
            if (props.autoGrow) adjustHeight()
        })
    })

    onBeforeUnmount(() => {
        if (resizeTimeout.value) cancelAnimationFrame(resizeTimeout.value)
    })

    // -------- VALIDACIÓN ----------
    const hasError = computed(() => {
        return !!(errorMessages.value.length || props.errorMessages?.length)
    })

    const displayedMessages = computed(() => {
        return hasError.value
            ? [...(props.errorMessages || []), ...errorMessages.value].slice(0, props.maxErrors)
            : []
    })

    function validate() {
        const rules = props.rules || []
        const value = props.required && !internalValue.value ? null : parseInputValue(internalValue.value)
        const errors = []

        for (const rule of rules) {
            const result = typeof rule === 'function' ? rule(value) : rule
            if (Array.isArray(result)) errors.push(...result)
            else if (typeof result === 'string') errors.push(result)
            else if (result === false) errors.push('Campo inválido')
        }

        errorMessages.value = errors
        return errors.length === 0
    }

    function resetValidation() {
        errorMessages.value = []
    }

    // -------- JSON: auto identación con tabulador ----------
    function handleJsonEnter(event) {
        if (!isJsonMode.value) return
        if (event.key !== 'Enter') return

        const input = inputRef.value
        if (!input) return

        const cursor = input.selectionStart
        const value = internalValue.value
        const indent = '  '
        const before = value.slice(0, cursor)
        const after = value.slice(cursor)

        const lineStart = before.lastIndexOf('\n') + 1
        const currentLine = before.slice(lineStart)
        const leadingSpaces = currentLine.match(/^\s*/)?.[0] ?? ''
        const newIndent = `\n${leadingSpaces}${indent}`

        internalValue.value = before + newIndent + after
        nextTick(() => {
            const newCursor = cursor + newIndent.length
            input.setSelectionRange(newCursor, newCursor)
        })

        event.preventDefault()
    }

    return {
        inputRef,
        internalValue,
        isFocused,
        hasError,
        displayedMessages,
        validate,
        resetValidation,
        updateModel,
        adjustHeight,
        handleJsonEnter,
    }
}
