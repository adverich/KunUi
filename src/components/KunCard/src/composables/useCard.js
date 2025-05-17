import { computed } from 'vue'

export function useCard(props) {
    const cardClass = computed(() => {
        return [
            props.bgColor,
            props.flat ? 'shadow-none' : `shadow-md`,
            props.rounded === true ? 'rounded-lg' : props.rounded ? `rounded-${props.rounded}` : '',
            props.class
        ].filter(Boolean)
    })

    const cardStyle = computed(() => {
        return props.style || {}
    })

    return {
        cardClass,
        cardStyle
    }
}