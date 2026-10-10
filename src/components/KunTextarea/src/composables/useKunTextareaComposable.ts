import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount, type Ref, type ComputedRef } from 'vue';

export interface KunTextareaPropsLike {
    modelValue?: unknown;
    formatModel?: unknown;
    rows?: unknown;
    maxRows?: unknown;
    autoGrow?: boolean;
    density?: unknown;
    errorMessages?: unknown;
    maxErrors?: unknown;
    rules?: unknown[];
    required?: boolean;
    error?: boolean;
}

export type KunTextareaEmit = (event: 'update:modelValue', value: unknown) => void;

interface ScrollState {
    textarea: number;
    parents: { element: HTMLElement; scrollTop: number }[];
}

export default function useTextarea(
    props: KunTextareaPropsLike,
    emit: KunTextareaEmit,
    textareaRef: Ref<HTMLTextAreaElement | null>,
) {
    const internalValue: Ref<string> = ref('')
    const rawModelValue: Ref<unknown> = ref(props.modelValue)
    const isFocused = ref(false)
    const errorMessages: Ref<string[]> = ref([])
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

    function formatInputValue(val: unknown): string {
        if (isJsonMode.value && val != null) {
            try {
                // Si ya es string, intentar parsear y re-formatear
                const parsed = typeof val === 'string' ? JSON.parse(val) : val
                return JSON.stringify(parsed, null, 2)
            } catch {
                // Si no es JSON válido, devolver el string tal cual
                return (val as string) ?? ''
            }
        }
        return (val as string) ?? ''
    }

    function parseInputValue(val: unknown): unknown {
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

    function updateModel(val: unknown): void {
        const parsed = parseInputValue(val)
        rawModelValue.value = parsed
        emit('update:modelValue', parsed)
    }

    // -------- CRECIMIENTO AUTOMÁTICO ----------
    // Función para guardar scroll positions de todos los contenedores
    const saveAllScrollPositions = (): ScrollState => {
        const textarea = textareaRef.value
        if (!textarea) return { textarea: 0, parents: [] }

        const textareaScrollTop = textarea.scrollTop
        const parents: { element: HTMLElement; scrollTop: number }[] = []

        // Recorrer todos los elementos padres hasta el root
        let parent = textarea.parentElement
        while (parent) {
            if (parent.scrollHeight > parent.clientHeight) {
                parents.push({
                    element: parent as HTMLElement,
                    scrollTop: parent.scrollTop
                })
            }
            parent = parent.parentElement
        }

        return { textarea: textareaScrollTop, parents }
    }

    // Función para restaurar scroll positions
    const restoreAllScrollPositions = (scrollState: ScrollState | null | undefined): void => {
        if (!scrollState) return

        // Restaurar scroll del textarea
        if (textareaRef.value) {
            textareaRef.value.scrollTop = scrollState.textarea
        }

        // Restaurar scroll de los contenedores padres
        scrollState.parents.forEach(({ element, scrollTop }: { element: HTMLElement; scrollTop: number }) => {
            element.scrollTop = scrollTop
        })
    }

    const adjustHeight = (): void => {
        if (!textareaRef.value) return

        // Guardar todos los scrolls antes de modificar
        const scrollState = saveAllScrollPositions()

        // Usar requestAnimationFrame para evitar reflows sincrónicos
        requestAnimationFrame(() => {
            const textarea = textareaRef.value
            if (!textarea) return

            const computed = getComputedStyle(textarea)
            const lineHeight = parseFloat(computed.lineHeight) || 20
            const paddingTop = parseFloat(computed.paddingTop) || 0
            const paddingBottom = parseFloat(computed.paddingBottom) || 0
            const borderTop = parseFloat(computed.borderTopWidth) || 0
            const borderBottom = parseFloat(computed.borderBottomWidth) || 0
            const verticalChrome = paddingTop + paddingBottom + borderTop + borderBottom
            const minRows = Math.max(Number(props.rows) || 1, 1)
            const minHeight = minRows * lineHeight + verticalChrome
            const maxRows = Number(props.maxRows || 0)

            textarea.style.height = 'auto'

            // scrollHeight con height:auto ya incluye padding pero no border
            const contentHeight = textarea.scrollHeight + borderTop + borderBottom
            let nextHeight = Math.max(contentHeight, minHeight)

            if (props.maxRows && maxRows > 0) {
                const maxHeight = maxRows * lineHeight + verticalChrome
                if (nextHeight > maxHeight) {
                    nextHeight = maxHeight
                    textarea.style.overflowY = 'auto'
                } else {
                    textarea.style.overflowY = 'hidden'
                }
            } else {
                textarea.style.overflowY = 'hidden'
            }

            textarea.style.height = nextHeight + 'px'

            // Restaurar todos los scroll positions
            restoreAllScrollPositions(scrollState)
        })
    }

    // -------- WATCH PRINCIPAL ----------
    watch(
        () => props.modelValue,
        (val: unknown) => {
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
    function handleJsonEnter(event: KeyboardEvent): void {
        if (!isJsonMode.value) return

        const textarea = textareaRef.value
        if (!textarea) return

        const start = textarea.selectionStart ?? 0
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

    // Si se desactiva autoGrow se libera la altura inline; si cambia rows/maxRows se recalcula
    watch(
        () => [props.autoGrow, props.rows, props.maxRows, props.density],
        ([autoGrow]: unknown[]) => {
            if (!textareaRef.value) return
            if (!autoGrow) {
                textareaRef.value.style.height = ''
                textareaRef.value.style.overflowY = ''
            } else {
                adjustHeight()
            }
        }
    )

    onBeforeUnmount(() => { })

    // -------- VALIDACIÓN ----------
    const hasError: ComputedRef<boolean> = computed(() => {
        return !!((errorMessages.value.length || (props.errorMessages as unknown[] | undefined)?.length))
    })

    const displayedMessages: ComputedRef<string[]> = computed(() => {
        return hasError.value
            ? [...((props.errorMessages as string[] | undefined) || []), ...errorMessages.value].slice(0, Number(props.maxErrors ?? 99))
            : []
    })

    function validate(): boolean {
        const rules = (props.rules || []) as ((value: unknown) => unknown)[]
        const value = props.required && !internalValue.value ? null : parseInputValue(internalValue.value)
        const errors: string[] = []

        for (const rule of rules) {
            const result = typeof rule === 'function' ? rule(value) : rule
            if (Array.isArray(result)) errors.push(...(result as string[]))
            else if (typeof result === 'string') errors.push(result)
            else if (result === false) errors.push('Campo inválido')
        }

        errorMessages.value = errors
        return errors.length === 0
    }

    function resetValidation(): void {
        errorMessages.value = []
    }

    function reset(): void {
        internalValue.value = ''
        rawModelValue.value = ''
        resetValidation()
        emit('update:modelValue', '')
    }

    return {
        internalValue,
        isFocused,
        hasError,
        displayedMessages,
        validate,
        resetValidation,
        reset,
        updateModel,
        adjustHeight,
        handleJsonEnter,
        isLocalChange,
    }
}
