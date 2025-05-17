export const kunCardTitleProps = {
    title: {
        type: String,
        default: null
    },
    subtitle: {
        type: String,
        default: null
    },
    prepend: {
        type: [String, Object, Function],
        default: null
    },
    append: {
        type: [String, Object, Function],
        default: null
    },
    bgColor: {
        type: String,
        default: 'bg-white'
    },
    textColor: {
        type: String,
        default: 'text-gray-800'
    },
    dense: {
        type: Boolean,
        default: false
    },
    flat: {
        type: Boolean,
        default: false
    },
    rounded: {
        type: [Boolean, String],
        default: false,
        validator: v => typeof v === 'boolean' || ['sm', 'md', 'lg', 'xl'].includes(v)
    },
    height: {
        type: [String, Number],
        default: 'auto'
    },
    width: {
        type: [String, Number],
        default: 'full'
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