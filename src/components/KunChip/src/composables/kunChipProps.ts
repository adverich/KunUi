import type { PropType } from 'vue';

export type KunChipVariant = 'default' | 'outlined' | 'flat' | 'pill';
export type KunChipDensity = 'default' | 'comfortable' | 'compact';

export const kunChipProps = {
    modelValue: {
        type: Boolean,
        default: true,
    },
    label: {
        type: String as PropType<string | null>,
        default: null as string | null,
    },
    closeLabel: {
        type: String,
        default: 'Cerrar',
    },
    text: {
        type: String as PropType<string | null>,
        default: null as string | null,
    },
    color: { type: String, default: 'bg-button' },
    textColor: {
        type: String,
        default: 'text-ui',
    },
    variant: {
        type: String as PropType<KunChipVariant>,
        default: 'default' as KunChipVariant,
        validator: (v: unknown): boolean => ['default', 'outlined', 'flat', 'pill'].includes(v as string),
    },
    clickable: {
        type: Boolean,
        default: true,
    },
    closable: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    density: {
        type: String as PropType<KunChipDensity>,
        default: 'default' as KunChipDensity,
        validator: (v: unknown): boolean => ['default', 'comfortable', 'compact'].includes(v as string),
    },
    prependIcon: {
        type: [String, Object, Function] as PropType<string | Record<string, unknown> | ((...args: never[]) => unknown) | null>,
        default: null,
    },
    appendIcon: {
        type: [String, Object, Function] as PropType<string | Record<string, unknown> | ((...args: never[]) => unknown) | null>,
        default: null,
    },
    to: {
        type: [String, Object] as PropType<string | Record<string, unknown> | null>,
        default: null,
    },
    href: {
        type: String as PropType<string | null>,
        default: null as string | null,
    },
    replace: {
        type: Boolean,
        default: false,
    },
    target: {
        type: String as PropType<string | null>,
        default: null as string | null,
    },
};
