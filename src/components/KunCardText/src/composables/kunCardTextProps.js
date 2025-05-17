export const kunCardTextProps = {
    text: {
        type: [String, Number],
        default: null
    },
    color: {
        type: String,
        default: 'text-gray-700'
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