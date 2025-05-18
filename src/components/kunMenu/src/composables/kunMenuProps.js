export const kunMenuProps = {
    modelValue: Boolean,
    activator: [String, Object],
    activatorProps: {
        type: Object,
        default: () => ({})
    },
    attach: [Boolean, String, Object],
    openOnClick: Boolean,
    openOnHover: Boolean,
    openOnFocus: Boolean,
    closeOnContentClick: { type: Boolean, default: true },
    closeOnBack: { type: Boolean, default: true },
    contained: Boolean,
    contentClass: [String, Array, Object],
    contentProps: {
        type: Object,
        default: () => ({})
    },
    disabled: Boolean,
    eager: Boolean,
    height: [String, Number],
    width: [String, Number],
    matchActivatorWidth: {
        type: Boolean,
        default: false
    },
    minHeight: [String, Number],
    minWidth: [String, Number],
    maxHeight: [String, Number],
    maxWidth: [String, Number],
    offset: [String, Number, Array],
    openDelay: { type: [String, Number], default: 100 },
    closeDelay: { type: [String, Number], default: 100 },
    location: { type: String, default: 'bottom' },
    origin: { type: String, default: 'auto' },
    transition: {
        type: [String, Object],
        default: 'scale',
        validator: v =>
            ['fade', 'slide-y', 'slide-left', 'slide-right', 'scale'].includes(v) ||
            (typeof v === 'object' && 'component' in v)
    },
    persistent: Boolean,
    zIndex: [String, Number],
    submenu: Boolean,
    scrim: [Boolean, String],
    opacity: { type: [Number, String], default: 1 },
    scrollStrategy: {
        type: [String, Function],
        default: 'reposition',
        validator: v =>
            ['close', 'block', 'reposition', 'none'].includes(v) || typeof v === 'function'
    },
    label: {
        type: String,
        default: 'Menú contextual'
    },
    keyboardNavigation: {
        type: Boolean,
        default: true
    }
}