import { computed } from 'vue'

export function useChip(props, emit) {
    const isLink = computed(() => !!props.to || !!props.href)

    const componentTag = computed(() => {
        if (props.href) return 'a'
        if (props.to) return 'router-link'
        return 'div' // Ya no es forzado a button
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
        return {}
    })

    const computedClass = computed(() => {
        const base = []

        if (props.density === 'compact') {
            base.push('px-2 py-0.5 text-xs')
        } else if (props.density === 'comfortable') {
            base.push('px-2.5 py-1 text-sm')
        } else {
            base.push('px-3 py-1.5 text-sm')
        }

        if (!props.clickable) {
            base.push('cursor-default')
        } else if (props.disabled) {
            base.push('opacity-50 cursor-not-allowed')
        } else {
            base.push('cursor-pointer')
        }

        switch (props.variant) {
            case 'flat':
                base.push(`${props.color} ${props.textColor} shadow-none`)
                break
            case 'outlined':
                base.push(`border border-current ${props.textColor} bg-transparent hover:bg-gray-100`)
                break
            case 'pill':
                base.push(`${props.color} ${props.textColor} rounded-full`)
                break
            default:
                base.push(`${props.color} ${props.textColor} rounded-md shadow`)
        }

        return base
    })

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
        computedClass,
        handleClose
    }
}
