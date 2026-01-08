import { ref, computed } from 'vue'

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
        const content = contentEl.value;

        if (!(parentEl instanceof HTMLElement) || !content) return;

        const parentRect = parentEl.getBoundingClientRect();

        if ((parentRect.width < 10 || parentRect.height < 10) && attempt < 10) {
            requestAnimationFrame(() => repositionMenu(attempt + 1));
            return;
        }

        requestAnimationFrame(() => {
            const contentRect = content.getBoundingClientRect();
            const contentWidth = contentRect.width || content.offsetWidth || 0;
            const contentHeight = contentRect.height || content.offsetHeight || 0;

            const scrollbarWidth = parentEl.offsetWidth - parentEl.clientWidth;
            const pxHideDetails = props.hideDetails ? 0 : 19;

            let top = parentRect.bottom - pxHideDetails;
            let left = parentRect.left;

            const origin = props.origin || 'auto';

            if (origin.includes('right')) {
                left = parentRect.right - contentWidth;
            } else if (origin.includes('center')) {
                left = parentRect.left + (parentRect.width / 2) - (contentWidth / 2);
            } else {
                left = parentRect.left;
            }

            if (origin.includes('top')) {
                top = parentRect.top - contentHeight;
            } else if (origin.includes('center')) {
                top = parentRect.top + (parentRect.height / 2) - (contentHeight / 2);
            } else {
                top = parentRect.bottom - pxHideDetails;
            }

            // console.log('[KunMenu] Posición calculada:', {
            //     origin,
            //     contentWidth,
            //     contentHeight,
            //     parentRight: parentRect.right,
            //     calculatedLeft: left,
            // });

            menuPositionStyle.value = {
                position: 'absolute',
                top: `${top}px`,
                left: `${left}px`,
                width: props.width === 'w-full' ? `${parentRect.width + scrollbarWidth}px` : undefined,
            };
        });
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
