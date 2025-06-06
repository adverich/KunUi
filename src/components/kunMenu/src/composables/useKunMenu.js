import { ref, watch } from 'vue'

export function useKunMenu(props, emits) {
    const menuVisible = ref(props.modelValue)
    const openTimeout = ref(null)
    const closeTimeout = ref(null)

    watch(() => props.modelValue, (val) => {
        menuVisible.value = val
        emits('update:modelValue', val)
    })

    function showMenu() {
        if (props.disabled) return
        clearTimeout(closeTimeout.value)
        openTimeout.value = setTimeout(() => {
            menuVisible.value = true
            emits('update:modelValue', true)
        }, +props.openDelay)
    }

    function hideMenu() {
        clearTimeout(openTimeout.value)
        closeTimeout.value = setTimeout(() => {
            menuVisible.value = false
            emits('update:modelValue', false)
        }, +props.closeDelay)
    }

    function toggleMenu() {
        menuVisible.value ? hideMenu() : showMenu()
    }

    function handleActivatorClick() {
        if (props.disabled || !props.openOnClick) return
        toggleMenu()
    }

    function handleHover(type) {
        if (!props.openOnHover || props.disabled) return
        clearTimeout(openTimeout.value)
        clearTimeout(closeTimeout.value)
        const delay = type === 'enter' ? props.openDelay : props.closeDelay
        setTimeout(() => {
            menuVisible.value = type === 'enter'
        }, +delay)
    }

    function handleFocus() {
        if (props.openOnFocus) menuVisible.value = true
    }

    function handleEscape() {
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
