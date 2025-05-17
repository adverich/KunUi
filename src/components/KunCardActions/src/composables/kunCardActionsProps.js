export const kunCardActionsProps = {
    gap: {
        type: [String, Number],
        default: 'gap-2'
    },
    justify: {
        type: String,
        default: 'justify-start',
        validator: v => ['justify-start', 'justify-end', 'justify-center', 'justify-between', 'justify-around'].includes(v)
    },
    align: {
        type: String,
        default: 'items-center',
        validator: v => ['items-start', 'items-end', 'items-center', 'items-stretch'].includes(v)
    },
    wrap: {
        type: Boolean,
        default: false
    },
    dense: {
        type: Boolean,
        default: false
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