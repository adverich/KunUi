import { computed } from 'vue'

export function useCardText(props) {
    const textClass = computed(() => {
        return [
            props.color,
            props.dense ? 'text-xs' : 'text-sm',
            props.class
        ].filter(Boolean)
    })

    const textStyle = computed(() => {
        return props.style || {}
    })

    return {
        textClass,
        textStyle
    }
}