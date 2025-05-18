import { ref, computed } from 'vue'

export function useTooltip(props) {
    const isVisible = ref(false)
    let showTimeout = null
    let hideTimeout = null

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
            case 'top': return 'border-b border-l border-gray-800 dark:border-gray-700'
            case 'bottom': return 'border-t border-l border-gray-800 dark:border-gray-700'
            case 'left': return 'border-r border-t border-gray-800 dark:border-gray-700'
            case 'right': return 'border-l border-t border-gray-800 dark:border-gray-700'
            default: return ''
        }
    })

    const arrowStyle = computed(() => {
        let style = {}
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

    const positionStyle = ref({})

    const calculatePosition = () => {
        if (!activator.value || !tooltip.value) return

        const activatorRect = activator.value.getBoundingClientRect()
        const tooltipRect = tooltip.value.getBoundingClientRect()

        let style = {}

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

    const activator = ref(null)
    const tooltip = ref(null)

    const scheduleShow = () => {
        if (props.disabled) return
        clearTimeout(hideTimeout)
        showTimeout = setTimeout(() => {
            isVisible.value = true
            calculatePosition()
        }, parseInt(props.delay))
    }

    const scheduleHide = () => {
        if (props.disabled) return
        clearTimeout(showTimeout)
        hideTimeout = setTimeout(() => {
            isVisible.value = false
        }, 100)
    }

    const onEnter = () => {
        if (props.openOn !== 'hover') return
        scheduleShow()
    }

    const onLeave = () => {
        if (props.openOn !== 'hover') return
        scheduleHide()
    }

    const onClick = () => {
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