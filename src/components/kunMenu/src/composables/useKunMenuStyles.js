import { ref, computed, onBeforeUnmount, nextTick } from 'vue'

export function useKunMenuStyles(props, handleActivatorClick, handleHover, handleFocus) {
    const menuPositionStyle = ref({})
    const activatorEl = ref(null)
    const contentEl = ref(null)

    const locationMap = {
        top: { class: 'origin-bottom' },
        bottom: { class: 'origin-top' },
        left: { class: 'origin-right' },
        right: { class: 'origin-left' }
    }

    const originClass = computed(() => {
        return locationMap[props.location]?.class || 'origin-top'
    })

    function repositionMenu(attempt = 0) {
        const el = activatorEl.value;
        if (!(el instanceof HTMLElement)) return;

        const rect = el.getBoundingClientRect();

        // Si el tamaño aún es inestable, reintenta hasta 10 veces
        if ((rect.width < 10 || rect.height < 10) && attempt < 10) {
            requestAnimationFrame(() => repositionMenu(attempt + 1));
            return;
        }

        // Calculamos la posición con el ajuste de top
        let top = rect.bottom;
        if (!props.hideDetails && props.parentRef?.$el) {
            top -= 15;
        }

        menuPositionStyle.value = {
            position: 'absolute',
            top: `${top + window.scrollY}px`,
            left: `${rect.left + window.scrollX}px`,
            width: `${rect.width}px`,
        };

        console.log('repositionMenu done:', menuPositionStyle.value);
    }




    function initializeMenu() {
        let el = null

        if (props.activator === 'parent') {
            el = props.parentRef?.$el || contentEl.value?.parentElement
        } else if (props.activator && typeof props.activator === 'object') {
            el = props.activator?.$el || props.activator?.$refs?.input || props.activator
        }

        if (!(el instanceof HTMLElement)) {
            console.warn('[KunMenu] Activator no válido:', el)
            return
        }

        if (el instanceof HTMLElement) {
            activatorEl.value = el

            el.addEventListener('click', handleActivatorClick)
            el.addEventListener('mouseenter', () => handleHover('enter'))
            el.addEventListener('mouseleave', () => handleHover('leave'))
            el.addEventListener('focus', handleFocus)
        }
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
        activatorEl,
        originClass,
        computedMaxHeight,
        menuPositionStyle,
    }
}
