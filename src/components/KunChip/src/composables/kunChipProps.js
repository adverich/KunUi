export const kunChipProps = {
    modelValue: {
        type: Boolean,
        default: true
    },
    label: {
        type: String,
        default: null
    },
    closeLabel: {
        type: String,
        default: 'Cerrar'
    },
    text: {
        type: String,
        default: null
    },
    color: {
        type: String,
        default: 'bg-indigo-600'
    },
    textColor: {
        type: String,
        default: 'text-white'
    },
    variant: {
        type: String,
        default: 'default',
        validator: v => ['default', 'outlined', 'flat', 'pill'].includes(v)
    },
    closable: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    density: {
        type: String,
        default: 'default',
        validator: v => ['default', 'comfortable', 'compact'].includes(v)
    },
    icon: {
        type: [String, Object, Function],
        default: null
    },
    prependIcon: {
        type: [String, Object, Function],
        default: null
    },
    appendIcon: {
        type: [String, Object, Function],
        default: null
    },
    to: {
        type: [String, Object],
        default: null
    },
    href: {
        type: String,
        default: null
    },
    replace: {
        type: Boolean,
        default: false
    },
    target: {
        type: String,
        default: null
    },
    class: {
        type: [String, Array, Object],
        default: null
    },
    style: {
        type: Object,
        default: null
    }
}