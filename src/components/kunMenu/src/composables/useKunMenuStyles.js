import { ref, computed, nextTick } from 'vue'

export function useKunMenuStyles(props, handleActivatorClick, handleHover, handleFocus) {
    const menuPositionStyle = ref({});
    const contentEl = ref(null);
    const activatorEl = ref(null);

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

            const origin = props.origin || defaultOriginFromLocation(props.location);
            const [verticalOrigin, horizontalOrigin] = origin.split(' ');

            const pxHideDetails = props.hideDetails ? 0 : 19;
            const contentWidth = menuEl.offsetWidth;
            const contentHeight = menuEl.offsetHeight;

            let top = 0;
            let left = 0;

            // Horizontal (X)
            if (horizontalOrigin === 'right') {
                left = parentRect.right - contentWidth;
            } else if (horizontalOrigin === 'center') {
                left = parentRect.left + (parentRect.width / 2) - (contentWidth / 2);
            } else {
                left = parentRect.left;
            }

            // Vertical (Y)
            if (verticalOrigin === 'top') {
                top = parentRect.top - contentHeight;
            } else if (verticalOrigin === 'center') {
                top = parentRect.top + (parentRect.height / 2) - (contentHeight / 2);
            } else {
                top = parentRect.bottom - pxHideDetails;
            }

            menuPositionStyle.value = {
                position: 'fixed',
                top: `${top}px`,
                left: `${left}px`,
                width: props.width === 'w-full' ? `${parentRect.width}px` : undefined,
            };

            // console.log('[KunMenu] Debug:', {
            //     origin,
            //     parent: {
            //         top: parentRect.top,
            //         bottom: parentRect.bottom,
            //         height: parentRect.height,
            //     },
            //     menu: {
            //         height: contentHeight,
            //         offsetHeight: menuEl.offsetHeight,
            //         rectHeight: menuRect.height,
            //     },
            //     calculatedTop: top,
            //     expectedTop: parentRect.top - contentHeight,
            // });
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
