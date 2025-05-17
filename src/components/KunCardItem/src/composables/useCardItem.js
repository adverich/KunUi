import { computed } from 'vue'

export function useCardItem(props) {
    const containerClass = computed(() => {
        return [
            'flex',
            'flex-col',
            props.dense ? 'py-1 px-2' : 'py-3 px-4',
            props.gap,
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