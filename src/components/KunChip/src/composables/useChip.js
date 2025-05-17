import { computed } from 'vue'

export function useChip(props, emit) {
    // Determina si es un link o botón
    const isLink = computed(() => !!props.to || !!props.href)

    const componentTag = computed(() => {
        if (props.href) return 'a'
        if (props.to) return 'router-link'
        return 'button'
    })

    const componentAttrs = computed(() => {
        if (props.href) {
            return {
                href: props.href,
                target: props.target ?? '_self',
                rel: props.target === '_blank' ? 'noopener noreferrer' : null
            }
        }
        if (props.to) {
            return {
                to: props.to,
                replace: props.replace
            }
        }
        return {
            type: 'button',
            disabled: props.disabled
        }
    })

    // Calcula clases dinámicas basadas en variantes
    const chipClass = computed(() => {
        const classes = [
            'inline-flex items-center whitespace-nowrap select-none',
            props.density === 'compact' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
            props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
            props.class
        ]

        switch (props.variant) {
            case 'flat':
                classes.push(`${props.color} ${props.textColor} shadow-none`)
                break
            case 'outlined':
                classes.push(`border border-current ${props.textColor} bg-transparent hover:bg-gray-100`)
                break
            case 'pill':
                classes.push(`${props.color} ${props.textColor} rounded-full`)
                break
            default:
                classes.push(`${props.color} ${props.textColor} rounded-md shadow`)
        }

        return classes.filter(Boolean)
    })

    const chipStyle = computed(() => {
        return props.style || {}
    })

    // Manejo de cierre
    const handleClose = (e) => {
        if (!props.disabled) {
            emit('update:modelValue', false)
            emit('click:close', e)
        }
    }

    return {
        isLink,
        componentTag,
        componentAttrs,
        chipClass,
        chipStyle,
        handleClose
    }
}