export const kunCardProps = {
    title: {
        type: String,
        default: null
    },
    subtitle: {
        type: String,
        default: null
    },
    text: {
        type: String,
        default: null
    },
    textColor: {
        type: String,
        default: 'text-black dark:text-white'
    },
    bgColor: {
        type: String,
        default: 'bg-transparent'
    },
    flat: {
        type: Boolean,
        default: false
    },
    rounded: {
        type: [Boolean, String],
        default: true,
        validator: v => typeof v === 'boolean' || ['sm', 'md', 'lg', 'xl'].includes(v)
    },
    outlined: {
        type: Boolean,
        default: false
    },
    outlineColor: {
        type: String,
        default: 'border-gray-300 dark:border-gray-600'
    },
    elevation: {
        type: [String, Number],
        default: 1,
        validator: v => ['0', '1', '2', '3', '4', '5', '', 0, 1, 2, 3, 4, 5].includes(v)
    },
}