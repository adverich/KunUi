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
        const textFieldEl = props.parentRef?.$el;
        if (!(textFieldEl instanceof HTMLElement)) return;

        const textFieldRect = textFieldEl.getBoundingClientRect();

        // Si el tamaño aún es inestable, reintenta hasta 10 veces
        if ((textFieldRect.width < 10 || textFieldRect.height < 10) && attempt < 10) {
            requestAnimationFrame(() => repositionMenu(attempt + 1));
            return;
        }

        // Obtiene el offset dinámico del contenedor
        const parent = textFieldEl.parentElement;
        const computedStyles = parent ? window.getComputedStyle(parent) : {};
        const marginTop = parseInt(computedStyles.marginTop, 10) || 0;
        const paddingTop = parseInt(computedStyles.paddingTop, 10) || 0;
        const parentOffset = marginTop + paddingTop;

        // Ajustamos la posición con compensación del scrollbar si es necesario
        const scrollbarWidth = textFieldEl.offsetWidth - textFieldEl.clientWidth;
        const pxHideDetails = props.hideDetails ? 0 : 15;

        menuPositionStyle.value = {
            position: 'absolute',
            top: `${textFieldRect.bottom - parentOffset - pxHideDetails}px`,
            left: `${textFieldRect.left}px`,
            width: `${textFieldRect.width + scrollbarWidth}px`
        };
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
