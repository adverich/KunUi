import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';

export default function useTextarea(props, emit, textareaRef) {
    const internalValue = ref('')
    const rawModelValue = ref(props.modelValue)
    const isFocused = ref(false)
    const errorMessages = ref([])

    // -------- FORMATO JSON ----------
    const isJsonMode = computed(() => {
        return props.formatModel === 'json' || (props.formatModel === 'auto' && typeof props.modelValue === 'object')
    })

    function formatInputValue(val) {
        if (isJsonMode.value && val != null) {
            try {
                return JSON.stringify(val, null, 2)
            } catch {
                return ''
            }
        }
        return val ?? ''
    }

    function parseInputValue(val) {
        if (isJsonMode.value && typeof val === 'string') {
            try {
                return JSON.parse(val)
            } catch {
                return null
            }
        }
        return val
    }

    function updateModel(val) {
        const parsed = parseInputValue(val)
        rawModelValue.value = parsed
        emit('update:modelValue', parsed)
    }

    // -------- WATCH PRINCIPAL ----------
    watch(
        () => props.modelValue,
        (val) => {
            const incoming = JSON.stringify(val)
            const current = JSON.stringify(rawModelValue.value)

            if (incoming !== current) {
                rawModelValue.value = val
                internalValue.value = formatInputValue(val)
                if (props.autoGrow) nextTick(() => adjustHeight())
            }
        },
        { immediate: true, deep: true }
    )

    // -------- CRECIMIENTO AUTOMÁTICO ----------
    const adjustHeight = () => {
        if (!textareaRef.value) return
        textareaRef.value.style.height = 'auto'
        textareaRef.value.style.overflowY = 'hidden'

        const scrollHeight = textareaRef.value.scrollHeight
        const lineHeight = parseFloat(getComputedStyle(textareaRef.value).lineHeight) || 24
        const maxRows = Number(props.maxRows || 0)

        if (props.maxRows && maxRows > 0) {
            const maxHeight = maxRows * lineHeight
            textareaRef.value.style.height = Math.min(scrollHeight, maxHeight) + 'px'
        } else {
            textareaRef.value.style.height = (scrollHeight - 16) + 'px'
        }
    }

    // -------- JSON: auto identación con tabulador ----------
    function handleJsonEnter(event) {
        if (!isJsonMode.value) return

        const textarea = textareaRef.value
        if (!textarea) return

        const start = textarea.selectionStart
        const value = internalValue.value
        const indent = '  '
        const before = value.slice(0, start)
        const after = value.slice(start)

        const lineStart = before.lastIndexOf('\n') + 1
        const currentLine = before.slice(lineStart)
        const leadingSpaces = currentLine.match(/^\s*/)?.[0] ?? ''
        const newIndent = `\n${leadingSpaces}${indent}`

        internalValue.value = before + newIndent + after
        nextTick(() => {
            const newCursor = start + newIndent.length
            textarea.setSelectionRange(newCursor, newCursor)
        })

        event.preventDefault()
    }

    onMounted(() => {
        internalValue.value = formatInputValue(props.modelValue)
        nextTick(() => {
            if (props.autoGrow) adjustHeight()
        })
    })

    onBeforeUnmount(() => { })

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

    return {
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
