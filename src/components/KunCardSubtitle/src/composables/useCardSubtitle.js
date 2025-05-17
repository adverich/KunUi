import { computed } from 'vue'

export function useCardSubtitle(props) {
    const subtitleClass = computed(() => {
        return [
            props.color,
            props.dense ? 'text-xs' : 'text-sm',
            props.class
        ].filter(Boolean)
    })

    const subtitleStyle = computed(() => {
        return props.style || {}
    })

    return {
        subtitleClass,
        subtitleStyle
    }
}