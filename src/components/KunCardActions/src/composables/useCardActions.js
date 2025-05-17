import { computed } from 'vue'

export function useCardActions(props) {
    const containerClass = computed(() => {
        return [
            'flex',
            props.wrap ? 'flex-wrap' : 'flex-nowrap',
            props.justify,
            props.align,
            props.gap,
            props.dense ? 'py-1 px-2' : 'py-3 px-4',
            props.class
        ].filter(Boolean)
    })

    const containerStyle = computed(() => {
        return props.style || {}
    })

    return {
        containerClass,
        containerStyle
    }
}