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

    let _rafId = null;
    let _scrollHandlers = [];

    function getScrollableAncestors(element) {
        const ancestors = [];
        let current = element.parentElement;

        while (current) {
            const style = window.getComputedStyle(current);
            const { overflowY, overflow } = style;
            if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay' ||
                overflow === 'auto' || overflow === 'scroll' || overflow === 'overlay') {
                ancestors.push(current);
            }
            current = current.parentElement;
        }

        return ancestors;
    }

    function startScrollTracking(parentEl) {
        stopScrollTracking();

        const el = parentEl?.$el || parentEl;
        if (!(el instanceof HTMLElement)) return;

        const scrollableAncestors = getScrollableAncestors(el);

        const onScroll = () => {
            if (_rafId) return;
            _rafId = requestAnimationFrame(() => {
                _rafId = null;
                repositionMenu();
            });
        };

        const winOptions = { capture: true, passive: true };
        window.addEventListener('scroll', onScroll, winOptions);
        _scrollHandlers.push({ target: window, handler: onScroll, options: winOptions });

        scrollableAncestors.forEach(ancestor => {
            const opts = { passive: true };
            ancestor.addEventListener('scroll', onScroll, opts);
            _scrollHandlers.push({ target: ancestor, handler: onScroll, options: opts });
        });
    }

    function stopScrollTracking() {
        if (_rafId) {
            cancelAnimationFrame(_rafId);
            _rafId = null;
        }

        _scrollHandlers.forEach(({ target, handler, options }) => {
            target.removeEventListener('scroll', handler, options);
        });
        _scrollHandlers = [];
    }

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
            const contentHeight = menuEl.offsetHeight;

            // When width='w-full' the menu gets the Tailwind class w-full (100vw on body teleport),
            // so offsetWidth is unreliable until the inline style is applied. Use parentRect.width instead.
            const effectiveWidth = props.width === 'w-full' ? parentRect.width : menuEl.offsetWidth;

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
                left = parentRect.right - effectiveWidth;
            } else if (horizontalOrigin === 'center') {
                left = parentRect.left + (parentRect.width / 2) - (effectiveWidth / 2);
            } else {
                left = parentRect.left;
            }

            // Horizontal boundary check (skip for w-full: menu matches parent width, parent is already in viewport)
            if (props.width !== 'w-full') {
                if (left + effectiveWidth > viewportWidth - margin) left = viewportWidth - effectiveWidth - margin;
                if (left < margin) left = margin;
            }

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
        if (props.maxHeight) return undefined
        if (smartMaxHeight.value === null) return undefined
        return `${smartMaxHeight.value}px`
    })

    return {
        initializeMenu,
        repositionMenu,
        startScrollTracking,
        stopScrollTracking,
        contentEl,
        activatorEl,
        originClass,
        computedMaxHeight,
        menuPositionStyle,
    }
}
