import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

export function useKunMenuStyles(props, contentEl, activatorEl, handleActivatorClick, handleHover, handleFocus) {

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

    function positionMenu() {
        if (!activatorEl.value || !contentEl.value) return

        const activatorRect = activatorEl.value.getBoundingClientRect()
        const scrollX = window.scrollX || window.pageXOffset
        const scrollY = window.scrollY || window.pageYOffset
        const content = contentEl.value

        let top = 0, left = 0
        const location = props.submenu ? 'right' : props.location

        switch (location) {
            case 'top':
                top = activatorRect.top - content.offsetHeight
                left = activatorRect.left
                break
            case 'bottom':
                top = activatorRect.bottom
                left = activatorRect.left
                break
            case 'left':
                top = activatorRect.top
                left = activatorRect.left - content.offsetWidth
                break
            case 'right':
                top = activatorRect.top
                left = activatorRect.right
                break
        }

        if (props.offset) {
            if (Array.isArray(props.offset)) {
                left += +props.offset[0]
                top += +props.offset[1]
            } else {
                const offsetVal = parseInt(props.offset)
                if (['top', 'bottom'].includes(location)) left += offsetVal
                else top += offsetVal
            }
        }

        content.style.position = 'absolute'
        content.style.top = `${top + scrollY}px`
        content.style.left = `${left + scrollX}px`
    }

    return {
        originClass,
        setMenuPosition,
    }
}
