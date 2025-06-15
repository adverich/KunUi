import { ref, computed, onBeforeUnmount, nextTick } from 'vue'

export function useKunMenuStyles(props, handleActivatorClick, handleHover, handleFocus) {
    const menuPositionStyle = ref({})
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
        const parentEl = props.parentRef;
        if (!(parentEl instanceof HTMLElement)) return;

        const parentRect = parentEl.getBoundingClientRect();

        if ((parentRect.width < 10 || parentRect.height < 10) && attempt < 10) {
            requestAnimationFrame(() => repositionMenu(attempt + 1));
            return;
        }

        // Optional: compensar si hay padding del padre que empuja visualmente
        // const parent = parentEl.parentElement;
        // const computedStyles = parent ? window.getComputedStyle(parent) : {};
        // const paddingBottom = parseFloat(computedStyles.paddingBottom || '0');
        // const marginBottom = parseFloat(computedStyles.marginBottom || '0');
        // const extraOffset = paddingBottom + marginBottom;

        // Ajustamos la posición con compensación del scrollbar si es necesario
        const scrollbarWidth = parentEl.offsetWidth - parentEl.clientWidth;
        const pxHideDetails = props.hideDetails ? 0 : 19;

        menuPositionStyle.value = {
            position: 'absolute',
            top: `${parentRect.bottom - pxHideDetails}px`,
            left: `${parentRect.left}px`,
            width: `${parentRect.width + scrollbarWidth}px`
        };
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
