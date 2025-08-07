export const kunCardProps = {
    title: { type: String, default: null },
    titleSize: {},
    subtitle: { type: String, default: null },
    subTitleSize: {},
    text: { type: String, default: null },
    textColor: { type: String, default: 'text-black dark:text-white' },
    bgColor: { type: String, default: 'bg-transparent' },
    flat: { type: Boolean, default: false },
    rounded: {
        type: [Boolean, String],
        default: true,
        validator: v => typeof v === 'boolean' || ['sm', 'md', 'lg', 'xl'].includes(v)
    },
    outlined: { type: Boolean, default: false },
    outlineColor: { type: String, default: 'border-gray-300 dark:border-gray-600' },
    elevation: {
        type: [String, Number],
        default: 1,
        validator: v => ['0', '1', '2', '3', '4', '5', '', 0, 1, 2, 3, 4, 5].includes(v)
    },
    to: [String, Object],
    href: String,
    replace: Boolean,

    // Nuevos props
    tag: { type: String, default: 'div' },
    disabled: { type: Boolean, default: false },
    ripple: { type: Boolean, default: true },
    variant: { type: String, default: 'elevated' },
    height: { type: String, default: null },
    width: { type: String, default: null },
    maxHeight: { type: String, default: null },
    maxWidth: { type: String, default: null },
    minHeight: { type: String, default: null },
    minWidth: { type: String, default: null },
    position: { type: String, default: null },
    prependIcon: { type: String, default: null },
    appendIcon: { type: String, default: null },
    prependAvatar: { type: String, default: null },
    appendAvatar: { type: String, default: null },
    image: { type: String, default: null },
    loading: { type: Boolean, default: false },
    density: {
        type: String,
        default: 'default',
        validator: v => ['default', 'comfortable', 'compact'].includes(v)
    },
    tile: { type: Boolean, default: false },
    exact: { type: Boolean, default: false },
    scrollable: { type: Boolean, default: false }
}
