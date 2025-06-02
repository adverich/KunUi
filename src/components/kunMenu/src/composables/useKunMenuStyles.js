import { computed, ref } from 'vue'

export function useKunMenuStyles(props, contentEl, activatorEl, handleActivatorClick, handleHover, handleFocus) {

    const menuPositionStyle = ref({})

    const locationMap = {
        top: { class: 'origin-bottom' },
        bottom: { class: 'origin-top' },
        left: { class: 'origin-right' },
        right: { class: 'origin-left' }
    }

    const originClass = computed(() => {
        return locationMap[props.location]?.class || 'origin-top'
    })

    function setMenuPosition() {
        if (props.activator === 'parent') {
            const el = contentEl.value?.parentElement;
            if (el) {
                el.addEventListener('click', handleActivatorClick);
                el.addEventListener('mouseenter', () => handleHover('enter'));
                el.addEventListener('mouseleave', () => handleHover('leave'));
                el.addEventListener('focus', handleFocus);
            }
        } else if (props.activator && typeof props.activator === 'object') {
            // Es un ref pasado desde fuera
            let el = props.activator?.value;

            // Si es un componente de Vue, accedemos a su $el o $refs.input si es un KunTextField
            if (el && el.$el) {
                el = el.$el;
            }

            // Soporte especial para KunTextField u otros que expongan refs internos
            if (el?.$refs?.input) {
                el = el.$refs.input;
            }

            if (el instanceof HTMLElement) {
                activatorEl.value = el;
                el.addEventListener('click', handleActivatorClick);
                el.addEventListener('mouseenter', () => handleHover('enter'));
                el.addEventListener('mouseleave', () => handleHover('leave'));
                el.addEventListener('focus', handleFocus);
            }
        }
    }

    function updatePosition() {
        const el = activatorEl.value
        if (!el) return

        if (props.textFieldRef?.$el) {
            const rect = el.getBoundingClientRect()

            let top = rect.bottom
            if (!props.hideDetails) top = top - 20;
            menuPositionStyle.value = {
                position: 'absolute',
                top: `${top}px`,
                left: `${rect.left}px`,
                width: `${rect.width}px`,
            }
        }
    }

    const computedMaxHeight = computed(() => {
        return typeof props.maxHeight === 'number'
            ? props.maxHeight + 'px'
            : undefined
    })

    return {
        originClass,
        setMenuPosition,
        updatePosition,
        computedMaxHeight
    }
}
