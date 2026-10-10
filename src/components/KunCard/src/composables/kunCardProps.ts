import type { PropType } from 'vue';

export type KunCardRounded = boolean | 'sm' | 'md' | 'lg' | 'xl';
export type KunCardElevation = '' | '0' | '1' | '2' | '3' | '4' | '5' | 0 | 1 | 2 | 3 | 4 | 5;
export type KunCardDensity = 'default' | 'comfortable' | 'compact';

export const kunCardProps = {
    title: { type: String, default: null },
    titleSize: { type: String, default: null },
    subtitle: { type: String, default: null },
    subTitleSize: { type: String, default: null },
    text: { type: String, default: null },
    textColor: { type: String, default: 'text-ui' },
    bgColor: { type: String, default: 'bg-transparent' },
    flat: { type: Boolean, default: false },
    rounded: {
        type: [Boolean, String] as PropType<KunCardRounded>,
        default: true,
        validator: (v: unknown) => typeof v === 'boolean' || ['sm', 'md', 'lg', 'xl'].includes(v as string)
    },
    outlined: { type: Boolean, default: false },
    outlineColor: { type: String, default: 'border-ui' },
    elevation: {
        type: [String, Number] as PropType<KunCardElevation>,
        default: 1,
        validator: (v: unknown) => ['0', '1', '2', '3', '4', '5', '', 0, 1, 2, 3, 4, 5].includes(v as string)
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
        type: String as PropType<KunCardDensity>,
        default: 'default',
        validator: (v: unknown) => ['default', 'comfortable', 'compact'].includes(v as string)
    },
    tile: { type: Boolean, default: false },
    exact: { type: Boolean, default: false },
    hover: { type: Boolean, default: false },
    scrollable: { type: Boolean, default: false }
}
