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
        default: 'bg-slate-200 dark:bg-slate-800'
    },
    textColor: {
        type: String,
        default: 'text-slate-700 dark:text-slate-300'
    },
    variant: {
        type: String,
        default: 'default',
        validator: v => ['default', 'outlined', 'flat', 'pill'].includes(v)
    },
    clickable: {
        type: Boolean,
        default: true
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
}
