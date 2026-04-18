import { ref, computed, nextTick } from 'vue'

export function useKunMenuStyles(props, handleActivatorClick, handleHover, handleFocus) {
    const menuPositionStyle = ref({});
    const contentEl = ref(null);
    const activatorEl = ref(null);
    const smartMaxHeight = ref(null);
    const currentPlacement = ref('bottom');

    const locationMap = {
        top: { class: 'origin-bottom' },
        bottom: { class: 'origin-top' },
        left: { class: 'origin-right' },
        right: { class: 'origin-left' }
    }

    const originClass = computed(() => {
        if (currentPlacement.value === 'top') return 'origin-bottom';
        return locationMap[props.location]?.class || 'origin-top'
    })

    function repositionMenu(attempt = 0) {
        const parentEl = props.parentRef || activatorEl.value;
        const menuEl = contentEl.value;

        if (!(parentEl instanceof HTMLElement) || !(menuEl instanceof HTMLElement)) return;

        const parentRect = parentEl.getBoundingClientRect();

        if ((parentRect.width < 1 || parentRect.height < 1) && attempt < 10) {
            requestAnimationFrame(() => repositionMenu(attempt + 1));
            return;
        }

        requestAnimationFrame(() => {
            const menuRect = menuEl.getBoundingClientRect();

            if ((menuRect.width < 1 || menuRect.height < 1) && attempt < 10) {
                requestAnimationFrame(() => repositionMenu(attempt + 1));
                return;
            }

            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
            const margin = 8;
            const pxHideDetails = props.hideDetails ? 0 : 19;
            const contentWidth = menuEl.offsetWidth;
            const contentHeight = menuEl.offsetHeight;

            // Smart vertical positioning: check available space above and below
            const spaceBelow = viewportHeight - parentRect.bottom + pxHideDetails - margin;
            const spaceAbove = parentRect.top - margin;

            const fitBelow = spaceBelow >= contentHeight;
            const fitAbove = spaceAbove >= contentHeight;

            // Prefer below unless it doesn't fit and above has more room
            const placeAbove = !fitBelow && (fitAbove || spaceAbove > spaceBelow);
            currentPlacement.value = placeAbove ? 'top' : 'bottom';

            // Horizontal positioning
            const origin = (props.origin && props.origin !== 'auto')
                ? props.origin
                : defaultOriginFromLocation(props.location);
            const [, horizontalOrigin] = origin.split(' ');

            let left = 0;
            if (horizontalOrigin === 'right') {
                left = parentRect.right - contentWidth;
            } else if (horizontalOrigin === 'center') {
                left = parentRect.left + (parentRect.width / 2) - (contentWidth / 2);
            } else {
                left = parentRect.left;
            }

            // Horizontal boundary check
            if (left + contentWidth > viewportWidth - margin) left = viewportWidth - contentWidth - margin;
            if (left < margin) left = margin;

            const newStyle = {
                position: 'fixed',
                left: `${left}px`,
                width: props.width === 'w-full' ? `${parentRect.width}px` : undefined,
            };

            if (placeAbove) {
                // Grow upwards using bottom CSS property
                newStyle.top = 'auto';
                newStyle.bottom = `${viewportHeight - parentRect.top}px`;
                smartMaxHeight.value = spaceAbove;
            } else {
                newStyle.top = `${parentRect.bottom - pxHideDetails}px`;
                newStyle.bottom = 'auto';
                smartMaxHeight.value = spaceBelow;
            }

            menuPositionStyle.value = newStyle;
        });
    }

    function defaultOriginFromLocation(location) {
        switch (location) {
            case 'top': return 'top left';
            case 'bottom': return 'bottom left';
            case 'left': return 'left top';
            case 'right': return 'right top';
            default: return 'bottom left';
        }
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
        const propsMax = typeof props.maxHeight === 'number'
            ? props.maxHeight
            : (props.maxHeight ? parseInt(props.maxHeight) : null);

        if (smartMaxHeight.value !== null) {
            const finalMax = propsMax ? Math.min(propsMax, smartMaxHeight.value) : smartMaxHeight.value;
            return `${finalMax}px`;
        }

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
