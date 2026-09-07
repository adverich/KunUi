// kunCardTitleProps.js
export const kunCardTitleProps = {
    title: String,
    titleSize: String,
    subtitle: String,
    prepend: [String, Object, Function],
    append: [String, Object, Function],
    bgColor: {
        type: String,
        default: 'bg-ransparent'
    },
    textColor: {
        type: String,
        default: 'text-ui'
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
    }
}
