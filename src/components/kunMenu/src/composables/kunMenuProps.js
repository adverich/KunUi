// kunMenuProps.js

export const kunMenuProps = {
    class: [String, Array, Object],
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
    contentClass: [String, Array, Object],
    disabled: Boolean,
    eager: Boolean,
    height: [String, Number],
    minHeight: [String, Number],
    maxHeight: [String, Number],
    width: {
        type: [String, Number],
        default: 'w-full'
    },
    minWidth: [String, Number],
    maxWidth: {
        type: [String, Number],
        default: 'w-full'
    },
    zIndex: { type: String, default: "z-50" },
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
        type: String,
        default: 'bottom',
        validator: v => ['top', 'bottom', 'left', 'right'].includes(v)
    },
    origin: {
        type: String,
        default: 'auto',
        validator: value => {
            const validOrigins = [
                'auto',
                'top left', 'top center', 'top right',
                'bottom left', 'bottom center', 'bottom right',
                'left top', 'left center', 'left bottom',
                'right top', 'right center', 'right bottom'
            ]
            return validOrigins.includes(value)
        }
    },
    transition: {
        type: String,
        default: 'scale',
        validator: value => ['fade', 'slide-y', 'slide-x', 'scale'].includes(value),
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
        default: false,
    },
}
