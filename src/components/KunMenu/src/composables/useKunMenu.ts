import { ref, watch, type Ref } from 'vue'

export interface KunMenuPropsLike {
    modelValue?: unknown;
    disabled?: boolean;
    openOnClick?: boolean;
    openOnHover?: boolean;
    openOnFocus?: boolean;
    openDelay?: unknown;
    closeDelay?: unknown;
}

export type KunMenuEmit = (event: 'update:modelValue' | 'handleEscape', value?: unknown) => void;

export function useKunMenu(props: KunMenuPropsLike, emits: KunMenuEmit) {
    const menuVisible = ref(props.modelValue)
    const openTimeout: Ref<ReturnType<typeof setTimeout> | null> = ref(null)
    const closeTimeout: Ref<ReturnType<typeof setTimeout> | null> = ref(null)

    watch(() => props.modelValue, (val: unknown) => {
        menuVisible.value = val
        emits('update:modelValue', val)
    })

    function clearRefTimeout(t: Ref<ReturnType<typeof setTimeout> | null>): void {
        if (t.value) {
            clearTimeout(t.value);
            t.value = null;
        }
    }

    function showMenu(): void {
        if (props.disabled) return
        clearRefTimeout(closeTimeout)
        openTimeout.value = setTimeout(() => {
            menuVisible.value = true
            emits('update:modelValue', true)
        }, Number(props.openDelay ?? 0))
    }

    function hideMenu(): void {
        clearRefTimeout(openTimeout)
        closeTimeout.value = setTimeout(() => {
            menuVisible.value = false
            emits('update:modelValue', false)
        }, Number(props.closeDelay ?? 0))
    }

    function toggleMenu(): void {
        menuVisible.value ? hideMenu() : showMenu()
    }

    function handleActivatorClick(): void {
        if (props.disabled || !props.openOnClick) return
        toggleMenu()
    }

    function handleHover(type: string): void {
        if (!props.openOnHover || props.disabled) return
        clearRefTimeout(openTimeout)
        clearRefTimeout(closeTimeout)
        const delay = type === 'enter' ? props.openDelay : props.closeDelay
        setTimeout(() => {
            menuVisible.value = type === 'enter'
        }, Number(delay ?? 0))
    }

    function handleFocus(): void {
        if (props.openOnFocus) menuVisible.value = true
    }

    function handleEscape(): void {
        hideMenu()
        emits('handleEscape')
    }

    return {
        menuVisible,
        showMenu,
        hideMenu,
        toggleMenu,
        handleActivatorClick,
        handleHover,
        handleFocus,
        handleEscape,
    }
}
