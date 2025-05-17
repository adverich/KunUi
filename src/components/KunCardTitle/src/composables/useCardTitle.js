import { computed } from 'vue'

export function useCardTitle(props) {
    const hasPrependIcon = computed(() => !!props.prepend)
    const hasAppendIcon = computed(() => !!props.append)

    const containerClass = computed(() => {
        return [
            props.dense ? 'py-1 px-2 text-sm' : 'py-3 px-4 text-base',
            props.flat ? 'shadow-none' : 'shadow',
            props.rounded === true ? 'rounded-md' : props.rounded ? `rounded-${props.rounded}` : '',
            props.bgColor,
            props.textColor,
            props.class
        ].filter(Boolean)
    })

    const containerStyle = computed(() => {
        const styles = props.style || {}
        if (props.height) {
            styles.height = typeof props.height === 'number' ? `${props.height}px` : props.height
        }
        if (props.width) {
            styles.width = typeof props.width === 'number' ? `${props.width}px` : props.width
        }
        return styles
    })

    const titleClass = computed(() => {
        return props.dense ? 'font-medium' : 'font-semibold'
    })

    const subtitleClass = computed(() => {
        return 'text-xs opacity-75 mt-1'
    })

    return {
        hasPrependIcon,
        hasAppendIcon,
        containerClass,
        containerStyle,
        titleClass,
        subtitleClass
    }
}