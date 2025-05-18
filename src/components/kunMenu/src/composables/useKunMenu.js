// src/components/KunMenu/composable/useKunMenu.js
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useKunMenuComposable } from './useKunMenuComposable'
import { useKunScrollStrategy } from './useKunScrollStrategy'

export function useKunMenu(props, emit) {
    const menuVisible = ref(props.modelValue)
    const activatorEl = ref(null)
    const contentEl = ref(null)
    const openTimeout = ref(null)
    const closeTimeout = ref(null)

    // Computed
    const computedWidth = computed(() =>
        typeof props.width === 'number' ? `${props.width}px` : props.width
    )
    const computedHeight = computed(() =>
        typeof props.height === 'number' ? `${props.height}px` : props.height
    )
    const computedMinWidth = computed(() =>
        typeof props.minWidth === 'number' ? `${props.minWidth}px` : props.minWidth
    )
    const computedMinHeight = computed(() =>
        typeof props.minHeight === 'number' ? `${props.minHeight}px` : props.minHeight
    )
    const computedMaxWidth = computed(() =>
        typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth
    )
    const computedMaxHeight = computed(() =>
        typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight
    )

    // Location mapping
    const locationMap = {
        top: { class: 'origin-bottom' },
        bottom: { class: 'origin-top' },
        left: { class: 'origin-right' },
        right: { class: 'origin-left' }
    }

    // Transition component
    const transitionComponent = computed(() => {
        return props.transition?.component || null
    })

    // Methods
    function showMenu() {
        if (props.disabled) return
        clearTimeout(closeTimeout.value)
        openTimeout.value = setTimeout(() => {
            menuVisible.value = true
            emit('update:modelValue', true)
        }, +props.openDelay)
    }

    function hideMenu() {
        if (props.persistent) return
        clearTimeout(openTimeout.value)
        closeTimeout.value = setTimeout(() => {
            menuVisible.value = false
            emit('update:modelValue', false)
        }, +props.closeDelay)
    }

    function toggleMenu() {
        menuVisible.value ? hideMenu() : showMenu()
    }

    function handleActivatorClick(e) {
        if (props.disabled) return
        if (props.openOnClick && !props.persistent) {
            toggleMenu()
        }
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
        if (props.openOnFocus) {
            menuVisible.value = true
        }
    }

    function handleContentClick(e) {
        if (props.closeOnContentClick && !props.persistent) {
            hideMenu()
        }
    }

    // Watchers
    watch(
        () => props.modelValue,
        (val) => {
            menuVisible.value = val
        }
    )

    watch(
        menuVisible,
        async (val) => {
            if (val) {
                await nextTick()
                positionMenu()
            }
        }
    )

    function positionMenu() {
        if (!activatorEl.value || !contentEl.value) return

        const rect = activatorEl.value.getBoundingClientRect()
        const scrollX = window.scrollX || window.pageXOffset
        const scrollY = window.scrollY || window.pageYOffset

        let top = 0
        let left = 0

        const finalLocation = props.submenu ? 'right' : props.location

        switch (finalLocation) {
            case 'top':
                top = rect.top - contentEl.value.offsetHeight
                left = rect.left
                break
            case 'bottom':
                top = rect.bottom
                left = rect.left
                break
            case 'left':
                top = rect.top
                left = rect.left - contentEl.value.offsetWidth
                break
            case 'right':
                top = rect.top
                left = rect.right
                break
            default:
                top = rect.bottom
                left = rect.left
        }

        if (props.offset) {
            if (Array.isArray(props.offset)) {
                left += props.offset[0]
                top += props.offset[1]
            } else {
                const offsetVal = parseInt(props.offset)
                if (['top', 'bottom'].includes(finalLocation)) {
                    left += offsetVal
                } else {
                    top += offsetVal
                }
            }
        }

        contentEl.value.style.top = `${top + scrollY}px`
        contentEl.value.style.left = `${left + scrollX}px`
    }

    // Keyboard Navigation
    function focusNextItem() {
        if (!props.keyboardNavigation) return
        const items = Array.from(contentEl.value.querySelectorAll('[role="menuitem"]'))
        const activeIndex = items.findIndex(el => document.activeElement === el)
        const nextIndex = (activeIndex + 1) % items.length
        items[nextIndex].focus()
    }

    function focusPrevItem() {
        if (!props.keyboardNavigation) return
        const items = Array.from(contentEl.value.querySelectorAll('[role="menuitem"]'))
        const activeIndex = items.findIndex(el => document.activeElement === el)
        const prevIndex = (activeIndex - 1 + items.length) % items.length
        items[prevIndex].focus()
    }

    function focusCurrentItem() {
        if (!props.keyboardNavigation) return
        const item = document.activeElement
        if (item && item.getAttribute('role') === 'menuitem') {
            item.click()
        }
    }

    // Lifecycle
    onMounted(async () => {
        if (props.activator === 'parent') {
            activatorEl.value = contentEl.value?.parentElement
        }

        // Click outside
        const { onClickOutside } = useKunMenuComposable()
        const { addEventListeners, removeEventListeners } = onClickOutside(
            contentEl,
            () => {
                if (!props.persistent) hideMenu()
            },
            [activatorEl]
        )

        addEventListeners()

        // Limpiar manualmente en caso de cambios dinámicos
        onBeforeUnmount(() => {
            removeEventListeners()
        })

        // Scroll strategy
        useKunScrollStrategy(props, hideMenu, positionMenu)
    })

    const computedTransition = computed(() => {
        // Transición personalizada pasada por props
        if (typeof props.transition === 'object') {
            return props.transition.component || 'transition'
        }

        // Transición dinámica basada en ubicación
        switch (props.location) {
            case 'top':
                return 'slide-y'
            case 'left':
                return 'slide-left'
            case 'right':
                return 'slide-right'
            default:
                return 'scale'
        }
    })

    const menuWidth = computed(() => {
        if (props.width) return props.width // Si se pasa width explícito, usala
        if (props.matchActivatorWidth && activatorEl.value) {
            const rect = activatorEl.value.getBoundingClientRect()
            return `${rect.width}px`
        }
        return 'auto'
    })

    return {
        menuVisible,
        activatorEl,
        contentEl,
        computedWidth,
        computedHeight,
        computedMinWidth,
        computedMinHeight,
        computedMaxWidth,
        computedMaxHeight,
        locationMap,
        transitionComponent,
        showMenu,
        hideMenu,
        toggleMenu,
        handleActivatorClick,
        handleHover,
        handleFocus,
        handleContentClick,
        positionMenu,
        focusNextItem,
        focusPrevItem,
        focusCurrentItem,
        computedTransition,
        menuWidth
    }
}