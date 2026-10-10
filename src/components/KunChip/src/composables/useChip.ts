import { computed, type ComputedRef } from 'vue'
import type { ExtractPropTypes } from 'vue'
import type { kunChipProps } from './kunChipProps.js'

type KunChipProps = ExtractPropTypes<typeof kunChipProps>;
type KunChipEmit = (event: 'update:modelValue' | 'click:close', value: unknown) => void;

export function useChip(props: KunChipProps, emit: KunChipEmit) {
    const isLink: ComputedRef<boolean> = computed(() => !!props.to || !!props.href)

    const componentTag: ComputedRef<string> = computed(() => {
        if (props.href) return 'a'
        if (props.to) return 'router-link'
        return 'div' // Ya no es forzado a button
    })

    const componentAttrs: ComputedRef<Record<string, unknown>> = computed(() => {
        if (props.href) {
            return {
                href: props.href,
                target: props.target ?? '_self',
                rel: props.target === '_blank' ? 'noopener noreferrer' : null,
            }
        }
        if (props.to) {
            return {
                to: props.to,
                replace: props.replace,
            }
        }
        return {}
    })

    const computedClass: ComputedRef<string[]> = computed(() => {
        const base: string[] = []

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
                base.push(`border border-current ${props.textColor} bg-transparent hover:bg-ui-hover`)
                break
            case 'pill':
                base.push(`${props.color} ${props.textColor} rounded-full`)
                break
            default:
                base.push(`${props.color} ${props.textColor} rounded-md shadow`)
        }

        return base
    })

    const handleClose = (e: Event): void => {
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
        handleClose,
    }
}
