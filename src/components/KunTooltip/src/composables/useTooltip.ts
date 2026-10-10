import { ref, computed, type Ref, type ComputedRef } from 'vue'

export interface KunTooltipPropsLike {
    location?: unknown;
    disabled?: boolean;
    delay?: unknown;
    openOn?: unknown;
    closeOnClick?: boolean;
}

export function useTooltip(props: KunTooltipPropsLike) {
    const isVisible = ref(false)
    let showTimeout: ReturnType<typeof setTimeout> | null = null
    let hideTimeout: ReturnType<typeof setTimeout> | null = null

    const positionClass = computed(() => {
        switch (props.location) {
            case 'top': return 'mb-2'
            case 'bottom': return 'mt-2'
            case 'left': return 'mr-2'
            case 'right': return 'ml-2'
            default: return ''
        }
    })

    const arrowClass = computed(() => {
        switch (props.location) {
            case 'top': return 'border-b border-l border-ui'
            case 'bottom': return 'border-t border-l border-ui'
            case 'left': return 'border-r border-t border-ui'
            case 'right': return 'border-l border-t border-ui'
            default: return ''
        }
    })

    const arrowStyle: ComputedRef<Record<string, string>> = computed(() => {
        const style: Record<string, string> = {}
        switch (props.location) {
            case 'top':
            case 'bottom':
                style.left = '50%'
                style.transform = 'translateX(-50%)'
                break
            case 'left':
            case 'right':
                style.top = '50%'
                style.transform = 'translateY(-50%)'
                break
        }
        return style
    })

    const positionStyle: Ref<Record<string, string>> = ref({})

    const activator: Ref<HTMLElement | null> = ref(null)
    const tooltip: Ref<HTMLElement | null> = ref(null)

    const calculatePosition = (): void => {
        if (!activator.value || !tooltip.value) return

        const activatorRect = activator.value.getBoundingClientRect()
        const tooltipRect = tooltip.value.getBoundingClientRect()

        const style: Record<string, string> = {}

        switch (props.location) {
            case 'top':
                style.top = `${activatorRect.top + window.scrollY - tooltipRect.height}px`
                style.left = `${activatorRect.left + window.scrollX + (activatorRect.width / 2)}px`
                break
            case 'bottom':
                style.top = `${activatorRect.bottom + window.scrollY}px`
                style.left = `${activatorRect.left + window.scrollX + (activatorRect.width / 2)}px`
                break
            case 'left':
                style.top = `${activatorRect.top + window.scrollY + (activatorRect.height / 2)}px`
                style.left = `${activatorRect.left + window.scrollX - tooltipRect.width}px`
                break
            case 'right':
                style.top = `${activatorRect.top + window.scrollY + (activatorRect.height / 2)}px`
                style.left = `${activatorRect.right + window.scrollX}px`
                break
        }

        positionStyle.value = style
    }

    const scheduleShow = (): void => {
        if (props.disabled) return
        if (hideTimeout) clearTimeout(hideTimeout)
        showTimeout = setTimeout(() => {
            isVisible.value = true
            calculatePosition()
        }, parseInt(String(props.delay ?? 0)))
    }

    const scheduleHide = (): void => {
        if (props.disabled) return
        if (showTimeout) clearTimeout(showTimeout)
        hideTimeout = setTimeout(() => {
            isVisible.value = false
        }, 100)
    }

    const onEnter = (): void => {
        if (props.openOn !== 'hover') return
        scheduleShow()
    }

    const onLeave = (): void => {
        if (props.openOn !== 'hover') return
        scheduleHide()
    }

    const onClick = (): void => {
        if (props.openOn === 'click') {
            isVisible.value = !isVisible.value
            if (isVisible.value) calculatePosition()
        }
        if (props.closeOnClick) {
            scheduleHide()
        }
    }

    return {
        isVisible,
        positionClass,
        arrowClass,
        positionStyle,
        arrowStyle,
        onEnter,
        onLeave,
        onClick,
        activator,
        tooltip
    }
}
