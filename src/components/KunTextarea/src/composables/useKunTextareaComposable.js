import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';

export default function useTextarea(props, emit, textareaRef) {
    const internalValue = ref('')
    const rawModelValue = ref(props.modelValue)
    const isFocused = ref(false)
    const errorMessages = ref([])
    const isLocalChange = ref(false) // Rastrea si el cambio es local (del input)

    // -------- FORMATO JSON ----------
    const isJsonMode = computed(() => {
        // Si es 'plain', nunca formatear como JSON
        if (props.formatModel === 'plain') return false
        
        // Si es 'json', siempre formatear
        if (props.formatModel === 'json') return true
        
        // Si es 'auto', detectar automáticamente
        if (props.formatModel === 'auto') {
            // Detectar si es objeto directamente
            if (typeof props.modelValue === 'object' && props.modelValue !== null) return true
            // Detectar si es string que parece JSON
            if (typeof props.modelValue === 'string') {
                const trimmed = props.modelValue.trim()
                return (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
                       (trimmed.startsWith('[') && trimmed.endsWith(']'))
            }
        }
        return false
    })

    function formatInputValue(val) {
        if (isJsonMode.value && val != null) {
            try {
                // Si ya es string, intentar parsear y re-formatear
                const parsed = typeof val === 'string' ? JSON.parse(val) : val
                return JSON.stringify(parsed, null, 2)
            } catch {
                // Si no es JSON válido, devolver el string tal cual
                return val ?? ''
            }
        }
        return val ?? ''
    }

    function parseInputValue(val) {
        if (isJsonMode.value && typeof val === 'string') {
            // Si el valor original era un string, mantener como string
            const wasOriginallyString = typeof props.modelValue === 'string'
            
            if (wasOriginallyString) {
                // Solo validar que es JSON válido, pero devolver como string
                try {
                    JSON.parse(val) // Validar
                    return val // Devolver como string formateado
                } catch {
                    return val // Si no es válido, devolver tal cual
                }
            }
            
            // Si el valor original era un objeto, convertir a objeto
            try {
                return JSON.parse(val)
            } catch {
                return val
            }
        }
        return val
    }

    function updateModel(val) {
        const parsed = parseInputValue(val)
        rawModelValue.value = parsed
        emit('update:modelValue', parsed)
    }

    // -------- CRECIMIENTO AUTOMÁTICO ----------
    // Función para guardar scroll positions de todos los contenedores
    const saveAllScrollPositions = () => {
        const textarea = textareaRef.value
        if (!textarea) return { textarea: 0, parents: [] }

        const textareaScrollTop = textarea.scrollTop
        const parents = []

        // Recorrer todos los elementos padres hasta el root
        let parent = textarea.parentElement
        while (parent) {
            if (parent.scrollHeight > parent.clientHeight) {
                parents.push({
                    element: parent,
                    scrollTop: parent.scrollTop
                })
            }
            parent = parent.parentElement
        }

        return { textarea: textareaScrollTop, parents }
    }

    // Función para restaurar scroll positions
    const restoreAllScrollPositions = (scrollState) => {
        if (!scrollState) return

        // Restaurar scroll del textarea
        if (textareaRef.value) {
            textareaRef.value.scrollTop = scrollState.textarea
        }

        // Restaurar scroll de los contenedores padres
        scrollState.parents.forEach(({ element, scrollTop }) => {
            element.scrollTop = scrollTop
        })
    }

    const adjustHeight = () => {
        if (!textareaRef.value) return

        // Guardar todos los scrolls antes de modificar
        const scrollState = saveAllScrollPositions()

        // Usar requestAnimationFrame para evitar reflows sincrónicos
        requestAnimationFrame(() => {
            const textarea = textareaRef.value
            if (!textarea) return

            textarea.style.height = 'auto'
            textarea.style.overflowY = 'hidden'

            const scrollHeight = textarea.scrollHeight
            const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight) || 24
            const maxRows = Number(props.maxRows || 0)

            if (props.maxRows && maxRows > 0) {
                const maxHeight = maxRows * lineHeight
                textarea.style.height = Math.min(scrollHeight, maxHeight) + 'px'
            } else {
                textarea.style.height = (scrollHeight - 16) + 'px'
            }

            // Restaurar todos los scroll positions
            restoreAllScrollPositions(scrollState)
        })
    }

    // -------- WATCH PRINCIPAL ----------
    watch(
        () => props.modelValue,
        (val) => {
            // Preservar scroll position ANTES de actualizar
            const scrollState = saveAllScrollPositions()
            const textarea = textareaRef.value
            const cursorStart = textarea ? textarea.selectionStart : null
            const cursorEnd = textarea ? textarea.selectionEnd : null

            rawModelValue.value = val
            const formattedVal = formatInputValue(val)
            internalValue.value = formattedVal

            // Actualizar el DOM directamente y restaurar scroll/cursor
            if (textarea) {
                // Solo actualizar el valor del DOM si es diferente (evita rerenderizado innecesario)
                if (textarea.value !== formattedVal) {
                    textarea.value = formattedVal
                }

                requestAnimationFrame(() => {
                    if (props.autoGrow) adjustHeight()

                    // Restaurar scroll y cursor
                    restoreAllScrollPositions(scrollState)
                    if (cursorStart !== null && cursorEnd !== null) {
                        textarea.setSelectionRange(cursorStart, cursorEnd)
                    }
                })
            }
            
            // Resetear isLocalChange después de procesar
            if (isLocalChange.value) {
                isLocalChange.value = false
            }
        },
        { immediate: true, deep: true }
    )

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
        isLocalChange,
    }
}
