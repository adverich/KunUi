import { ref, computed, nextTick } from 'vue'

export function useKunMenuStyles(props, handleActivatorClick, handleHover, handleFocus) {
    const menuPositionStyle = ref({})
    const contentEl = ref(null)

    const originMap = {
        'top left': 'origin-bottom-left',
        'top center': 'origin-bottom',
        'top right': 'origin-bottom-right',
        'bottom left': 'origin-top-left',
        'bottom center': 'origin-top',
        'bottom right': 'origin-top-right',
        'left top': 'origin-right-top',
        'left center': 'origin-right',
        'left bottom': 'origin-right-bottom',
        'right top': 'origin-left-top',
        'right center': 'origin-left',
        'right bottom': 'origin-left-bottom'
    }

    const originClass = computed(() => {
        if (props.origin !== 'auto') {
            return originMap[props.origin] || 'origin-top'
        }

        const fallbackMap = {
            top: 'origin-bottom',
            bottom: 'origin-top',
            left: 'origin-right',
            right: 'origin-left'
        }
        return fallbackMap[props.location] || 'origin-top'
    })

    function repositionMenu(attempt = 0) {
        const activator = props.parentRef?.$el
        const menu = contentEl.value

        if (!(activator instanceof HTMLElement) || !(menu instanceof HTMLElement)) {
            console.warn('[KunMenu] Activator o menú no son elementos válidos')
            return
        }

        const activatorRect = activator.getBoundingClientRect()
        const menuRect = menu.getBoundingClientRect()

        console.log('[KunMenu] Activator rect:', activatorRect)
        console.log('[KunMenu] Menu rect:', menuRect)

        // Si el activador o el menú aún no están bien renderizados
        if (
            (activatorRect.width < 10 || activatorRect.height < 10 || menuRect.width === 0 || menuRect.height === 0) &&
            attempt < 10
        ) {
            console.log(`[KunMenu] Reintentando posicionamiento, intento #${attempt + 1}`)
            setTimeout(() => requestAnimationFrame(() => repositionMenu(attempt + 1)), 100)
            return
        }

        const parent = activator.parentElement
        const computedStyles = parent ? window.getComputedStyle(parent) : {}
        const marginTop = parseInt(computedStyles.marginTop, 10) || 0
        const paddingTop = parseInt(computedStyles.paddingTop, 10) || 0
        const parentOffset = marginTop + paddingTop

        let top = 0
        let left = 0
        let width = activatorRect.width

        const [originVert, originHoriz] = props.origin === 'auto'
            ? (() => {
                if (props.location === 'bottom' || props.location === 'top') {
                    return [props.location, 'left']
                } else if (props.location === 'left' || props.location === 'right') {
                    return ['top', props.location]
                }
                return ['bottom', 'left']
            })()
            : props.origin.split(' ')

        if (props.location === 'bottom') {
            top = activatorRect.bottom - parentOffset + window.scrollY
            left = originHoriz === 'right'
                ? activatorRect.right - menuRect.width + window.scrollX
                : originHoriz === 'center'
                    ? activatorRect.left + (activatorRect.width / 2) - (menuRect.width / 2) + window.scrollX
                    : activatorRect.left + window.scrollX

        } else if (props.location === 'top') {
            top = activatorRect.top - menuRect.height - parentOffset + window.scrollY
            left = originHoriz === 'right'
                ? activatorRect.right - menuRect.width + window.scrollX
                : originHoriz === 'center'
                    ? activatorRect.left + (activatorRect.width / 2) - (menuRect.width / 2) + window.scrollX
                    : activatorRect.left + window.scrollX

        } else if (props.location === 'left') {
            left = activatorRect.left - menuRect.width + window.scrollX
            top = originVert === 'bottom'
                ? activatorRect.bottom - menuRect.height + window.scrollY
                : originVert === 'center'
                    ? activatorRect.top + (activatorRect.height / 2) - (menuRect.height / 2) + window.scrollY
                    : activatorRect.top + window.scrollY
            width = undefined

        } else if (props.location === 'right') {
            left = activatorRect.right + window.scrollX
            top = originVert === 'bottom'
                ? activatorRect.bottom - menuRect.height + window.scrollY
                : originVert === 'center'
                    ? activatorRect.top + (activatorRect.height / 2) - (menuRect.height / 2) + window.scrollY
                    : activatorRect.top + window.scrollY
            width = undefined
        } else {
            top = activatorRect.bottom - parentOffset + window.scrollY
            left = activatorRect.left + window.scrollX
        }

        // Viewport boundaries
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        if (left + menuRect.width > viewportWidth) left = viewportWidth - menuRect.width - 8
        if (left < 8) left = 8

        if (top + menuRect.height > viewportHeight + window.scrollY)
            top = viewportHeight + window.scrollY - menuRect.height - 8
        if (top < 8 + window.scrollY) top = 8 + window.scrollY

        const styleObj = {
            position: 'absolute',
            top: `${top}px`,
            left: `${left}px`,
            transformOrigin: originClass.value.replace('origin-', '').replace('-', ' '),
        }

        if (width !== undefined) {
            styleObj.width = typeof width === 'number' ? `${width}px` : width
        }

        menuPositionStyle.value = styleObj

        console.log('[KunMenu] Estilo aplicado:', styleObj)
    }


    function initializeMenu() {
        const el = props.parentRef?.$el || contentEl.value?.parentElement

        if (!(el instanceof HTMLElement)) {
            console.warn('[KunMenu] Activator no válido:', el)
            return
        }

        el.addEventListener('click', handleActivatorClick)
        el.addEventListener('mouseenter', () => handleHover('enter'))
        el.addEventListener('mouseleave', () => handleHover('leave'))
        el.addEventListener('focus', handleFocus)
    }

    const computedMaxHeight = computed(() => {
        return typeof props.maxHeight === 'number'
            ? props.maxHeight + 'px'
            : props.maxHeight
    })

    return {
        initializeMenu,
        repositionMenu,
        contentEl,
        originClass,
        computedMaxHeight,
        menuPositionStyle,
    }
}
