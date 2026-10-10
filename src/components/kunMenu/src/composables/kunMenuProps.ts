// kunMenuProps.js
import type { PropType } from 'vue';

export type KunMenuLocation = 'top' | 'bottom' | 'left' | 'right';
export type KunMenuOrigin =
  | 'auto'
  | 'top left' | 'top center' | 'top right'
  | 'bottom left' | 'bottom center' | 'bottom right'
  | 'left top' | 'left center' | 'left bottom'
  | 'right top' | 'right center' | 'right bottom';
export type KunMenuTransition =
  | 'fade' | 'fade-scale' | 'slide-down' | 'slide-up' | 'slide-left' | 'slide-right' | 'none';

export const kunMenuProps = {
    class: [String, Array, Object],
    bgColor: { type: String, default: 'bg-menu' },
    modelValue: Boolean,
    activator: [String, Object],
    activatorProps: {
        type: Object,
        default: () => ({})
    },
    parentRef: Object,
    attach: [Boolean, String, Object],
    openOnClick: Boolean,
    openOnHover: Boolean,
    openOnFocus: Boolean,
    closeOnContentClick: {
        type: Boolean,
        default: true
    },
    closeOnBack: {
        type: Boolean,
        default: true
    },
    contained: Boolean,
    disabled: Boolean,
    eager: Boolean,
    minHeight: [String, Number],
    height: [String, Number],
    maxHeight: [String, Number],
    width: {
        type: [String, Number],
        default: 'w-fit'
    },
    minWidth: [String, Number],
    maxWidth: [String, Number],
    offset: [String, Number, Array],
    openDelay: {
        type: [String, Number],
        default: 100
    },
    closeDelay: {
        type: [String, Number],
        default: 100
    },
    location: {
        type: String as PropType<KunMenuLocation>,
        default: 'bottom',
        validator: (v: unknown) => ['top', 'bottom', 'left', 'right'].includes(v as string)
    },
    origin: {
        type: String as PropType<KunMenuOrigin>,
        default: 'auto',
        validator: (value: unknown) => {
            const validOrigins = [
                'auto',
                'top left', 'top center', 'top right',
                'bottom left', 'bottom center', 'bottom right',
                'left top', 'left center', 'left bottom',
                'right top', 'right center', 'right bottom'
            ]
            return validOrigins.includes(value as string)
        }
    },
    transition: {
        type: String as PropType<KunMenuTransition>,
        default: 'fade-scale', // animación por defecto
        validator: (val: unknown) => [
            'fade', 'fade-scale', 'slide-down', 'slide-up', 'slide-left', 'slide-right', 'none'
        ].includes(val as string)
    },
    persistent: Boolean,
    zIndex: [String, Number],
    submenu: Boolean,
    label: {
        type: String,
        default: 'Menú contextual'
    },
    keyboardNavigation: {
        type: Boolean,
        default: true
    },
    hideDetails: {
        type: Boolean,
        default: true,
    },
}
