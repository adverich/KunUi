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

    function resolveParentEl() {
        const p = props.parentRef;
        if (!p) return activatorEl.value;
        return p?.$el ?? p?.value ?? p ?? null;
    }

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

        const onScroll = (e) => {
            // El scroll interno del propio menú no mueve al activador: ignorarlo
            // evita recálculos (y parpadeo) al usar rueda o arrastrar el scrollbar.
            const t = e?.target;
            if (t instanceof HTMLElement && contentEl.value?.contains(t)) return;
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
        const parentEl = resolveParentEl();
        const menuEl = contentEl.value;

        if (!(parentEl instanceof HTMLElement) || !(menuEl instanceof HTMLElement)) return;

        const parentRect = parentEl.getBoundingClientRect();

        if ((parentRect.width < 1 || parentRect.height < 1) && attempt < 10) {
            requestAnimationFrame(() => repositionMenu(attempt + 1));
            return;
        }

        // Tope síncrono: el menú nace ya limitado al espacio disponible
        // (evita el primer pintado sin cap mientras el rAF mide el contenido).
        // Respeta el lado actual: si el menú está colocado arriba hay que usar
        // spaceAbove; forzar spaceBelow lo encogería y el rAF lo restauraría
        // (= parpadeo en cada scroll). Primera apertura: 'bottom' por defecto.
        {
            const viewportHeight = window.innerHeight;
            const margin = 8;
            const pxHideDetails = props.hideDetails ? 0 : 19;
            const spaceBelowSync = viewportHeight - parentRect.bottom + pxHideDetails - margin;
            const spaceAboveSync = parentRect.top - margin;
            const syncSpace = currentPlacement.value === 'top' ? spaceAboveSync : spaceBelowSync;
            smartMaxHeight.value = Math.max(0, Math.round(syncSpace));
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
            // Altura REAL del contenido (sin cap): el menú ya viene limitado
            // por max-height, así que offsetHeight siempre "entraría" abajo y
            // nunca se detectaría que debe abrir hacia arriba. scrollHeight
            // ignora el cap y permite decidir el lado con más espacio.
            const contentHeight = Math.max(menuEl.scrollHeight, menuEl.offsetHeight);

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
        const el = resolveParentEl() || contentEl.value?.parentElement

        if (!(el instanceof HTMLElement)) {
            console.warn('[KunMenu] Activator no válido:', el)
            return
        }

        el.addEventListener('click', handleActivatorClick)
        el.addEventListener('mouseenter', () => handleHover('enter'))
        el.addEventListener('mouseleave', () => handleHover('leave'))
        el.addEventListener('focus', handleFocus)
    }

    // --- Resolución de maxHeight de usuario a CSS + px (para min() con el espacio) ---
    // Acepta: Number (px), string numérico, unidades CSS, funciones CSS y
    // clases Tailwind max-h-* (escala -> rem, arbitrarias max-h-[...] -> CSS interno).
    const TAILWIND_SPACING_PX = {
        'px': 1, '0': 0, '0.5': 2, '1': 4, '1.5': 6, '2': 8, '2.5': 10,
        '3': 12, '3.5': 14, '4': 16, '5': 20, '6': 24, '7': 28, '8': 32,
        '9': 36, '10': 40, '11': 44, '12': 48, '14': 56, '16': 64, '20': 80,
        '24': 96, '28': 112, '32': 128, '36': 144, '40': 160, '44': 176,
        '48': 192, '52': 208, '56': 224, '60': 240, '64': 256, '72': 288,
        '80': 320, '96': 384,
        'xs': 320, 'sm': 384, 'md': 448, 'lg': 512, 'xl': 576,
        '2xl': 672, '3xl': 768, '4xl': 896, '5xl': 1024, '6xl': 1152, '7xl': 1280,
    };

    function normalizeUserMaxHeight(prop) {
        if (prop === null || prop === undefined || prop === '') return undefined;
        if (typeof prop === 'number' && Number.isFinite(prop)) return `${prop}px`;
        if (typeof prop !== 'string') return undefined;
        const v = prop.trim();
        if (!v) return undefined;
        // Clase Tailwind arbitraria: max-h-[320px] -> 320px
        const arbitrary = v.match(/^max-h-\[(.+)\]$/);
        if (arbitrary) return normalizeUserMaxHeight(arbitrary[1]);
        // Escala Tailwind: max-h-64 -> 16rem
        const scale = v.match(/^max-h-(.+)$/);
        if (scale) {
            const key = scale[1];
            if (key in TAILWIND_SPACING_PX) {
                const px = TAILWIND_SPACING_PX[key];
                return `${px / 16}rem`;
            }
            if (key === 'full') return '100%';
            if (key === 'screen' || key === 'svh' || key === 'lvh' || key === 'dvh') return '100vh';
            if (key === 'min') return 'min-content';
            if (key === 'max') return 'max-content';
            if (key === 'fit') return 'fit-content';
            return undefined;
        }
        // Numérico puro -> px
        if (/^-?[\d.]+$/.test(v)) return `${v}px`;
        // Tamaño CSS o función CSS -> tal cual
        if (/^-?[\d.]+(px|rem|em|vh|vw|dvh|dvw|svh|svw|lvh|lvw|vmin|vmax|%|ch|ex|cap|ic|lh|rlh|vi|vb|cqw|cqh|cqi|cqb|cqmin|cqmax|cm|mm|in|pt|pc)$/.test(v)) return v;
        if (/^(calc|min|max|clamp|var|env)\(.*\)$/.test(v)) return v;
        return undefined;
    }

    function cssToPx(css) {
        if (!css || typeof window === 'undefined') return null;
        const px = css.match(/^(-?[\d.]+)px$/);
        if (px) return parseFloat(px[1]);
        const rem = css.match(/^(-?[\d.]+)r?em$/);
        if (rem) return parseFloat(rem[1]) * 16;
        const vh = css.match(/^(-?[\d.]+)(vh|dvh|svh|lvh)$/);
        if (vh) return (parseFloat(vh[1]) / 100) * window.innerHeight;
        const vw = css.match(/^(-?[\d.]+)(vw|dvw|svw|lvw)$/);
        if (vw) return (parseFloat(vw[1]) / 100) * window.innerWidth;
        const vmin = css.match(/^(-?[\d.]+)vmin$/);
        if (vmin) return (parseFloat(vmin[1]) / 100) * Math.min(window.innerHeight, window.innerWidth);
        const vmax = css.match(/^(-?[\d.]+)vmax$/);
        if (vmax) return (parseFloat(vmax[1]) / 100) * Math.max(window.innerHeight, window.innerWidth);
        return null;
    }

    const userMaxHeightCss = computed(() => normalizeUserMaxHeight(props.maxHeight));

    const computedMaxHeight = computed(() => {
        const smart = smartMaxHeight.value;
        const user = userMaxHeightCss.value;
        // Sin límite de usuario: ocupa todo el espacio disponible.
        if (smart === null && !user) return undefined;
        if (smart === null) return user;
        if (!user) return `${smart}px`;
        // Con límite de usuario: min(usuario, espacio disponible).
        const userPx = cssToPx(user);
        if (userPx !== null) return `${Math.max(0, Math.round(Math.min(userPx, smart)))}px`;
        return `min(${user}, ${smart}px)`;
    })

    // Reposiciona si el contenido crece tarde (batches, fuentes, slots) y el
    // menú queda fuera del viewport. Con rAF-throttle y sin bucles: cuando el
    // max-height ya limita, el tamaño deja de cambiar y el observer se aquieta.
    let _contentRo = null;
    let _contentRaf = null;

    function startContentTracking() {
        stopContentTracking();
        const menuEl = contentEl.value;
        if (!(menuEl instanceof HTMLElement) || typeof ResizeObserver === 'undefined') return;
        _contentRo = new ResizeObserver(() => {
            if (_contentRaf) return;
            _contentRaf = requestAnimationFrame(() => {
                _contentRaf = null;
                const el = contentEl.value;
                if (!(el instanceof HTMLElement)) return;
                const r = el.getBoundingClientRect();
                // Holgura de 4px: el menú calza justo al margen de 8px y el
                // redondeo de subpíxeles no debe disparar reposiciones fantasma.
                if (r.bottom > window.innerHeight - 4 || r.top < 4) {
                    repositionMenu();
                }
            });
        });
        _contentRo.observe(menuEl);
    }

    function stopContentTracking() {
        if (_contentRaf) {
            cancelAnimationFrame(_contentRaf);
            _contentRaf = null;
        }
        if (_contentRo) {
            _contentRo.disconnect();
            _contentRo = null;
        }
    }

    return {
        initializeMenu,
        repositionMenu,
        startScrollTracking,
        stopScrollTracking,
        startContentTracking,
        stopContentTracking,
        contentEl,
        activatorEl,
        originClass,
        computedMaxHeight,
        menuPositionStyle,
    }
}
