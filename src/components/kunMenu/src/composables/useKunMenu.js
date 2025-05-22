import { ref, computed, watch } from 'vue'
import { useKunMenuComposable } from './useKunMenuComposable'

export function useKunMenu(props, emits) {
    const menuVisible = ref(props.modelValue)
    const activatorEl = ref(null)
    const contentEl = ref(null)
    const openTimeout = ref(null)
    const closeTimeout = ref(null)

    watch(() => props.modelValue, (val) => {
        menuVisible.value = val
        if (val) {
            emits('update:modelValue', true);
            document.addEventListener('click', handleClickOutside);
        } else {
            emits('update:modelValue', false);
            document.removeEventListener('click', handleClickOutside);
        }
    })

    function showMenu() {
        if (props.disabled) return
        clearTimeout(closeTimeout.value)
        openTimeout.value = setTimeout(() => {
            menuVisible.value = true
            emits('update:modelValue', true)
        }, +props.openDelay)

        console.log(1)
        document.addEventListener('click', handleClickOutside);
    }

    function hideMenu() {
        clearTimeout(openTimeout.value)
        closeTimeout.value = setTimeout(() => {
            menuVisible.value = false
            emits('update:modelValue', false)
        }, +props.closeDelay)

        console.log(2)
        document.removeEventListener('click', handleClickOutside);
    }

    function toggleMenu() {
        // menuVisible.value ? hideMenu() : showMenu()
    }

    function handleActivatorClick() {
        if (props.disabled || !props.openOnClick) return
        toggleMenu()
    }

    function handleHover(type) {
        // if (!props.openOnHover || props.disabled) return
        // clearTimeout(openTimeout.value)
        // clearTimeout(closeTimeout.value)
        // const delay = type === 'enter' ? props.openDelay : props.closeDelay
        // setTimeout(() => {
        //     menuVisible.value = type === 'enter'
        // }, +delay)
    }

    function handleFocus() {
        if (props.openOnFocus) menuVisible.value = true
    }

    function handleClickOutside(event) {
        if (
            menuVisible.value &&
            contentEl.value &&
            !contentEl.value.contains(event.target) &&
            !props.textFieldRef.$el.contains(event.target) // Si el click ocurre en el input, no cerrar
        ) {
            hideMenu();
        }
    }

    function handleEscape(event) {
        console.log('Escape pressed')
        hideMenu();
        emits('handleEscape');
    }

    function focusCurrentItem() {
        if (!props.keyboardNavigation) return
        const item = document.activeElement
        if (item?.getAttribute('role') === 'menuitem') item.click()
    }

    function initMenu() {
        const { onClickOutside } = useKunMenuComposable()
        // const { addEventListeners, removeEventListeners } = onClickOutside(
        //     contentEl,
        //     () => hideMenu(),
        //     [activatorEl]
        // )
        // addEventListeners()

        // onBeforeUnmount(() => {
        //     removeEventListeners()
        //     clearTimeout(openTimeout.value)
        //     clearTimeout(closeTimeout.value)
        // })
    }

    return {
        menuVisible,
        activatorEl,
        contentEl,
        showMenu,
        hideMenu,
        toggleMenu,
        initMenu,
        handleActivatorClick,
        handleClickOutside,
        handleHover,
        handleFocus,
        handleEscape,
        focusCurrentItem,
    }
}
