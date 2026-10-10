import type { PropType } from 'vue';

export type KunChipVariant = 'default' | 'outlined' | 'flat' | 'pill';
export type KunChipDensity = 'default' | 'comfortable' | 'compact';

export const kunChipProps = {
    /** Visibilidad del chip (v-model). En `false` con `closable` muestra botón cerrar. */
    modelValue: {
        type: Boolean,
        default: true,
    },
    /** Texto principal (alternativa al slot). */
    label: {
        type: String as PropType<string | null>,
        default: null as string | null,
    },
    /** Etiqueta accesible del botón cerrar. */
    closeLabel: {
        type: String,
        default: 'Cerrar',
    },
    /** Texto secundario (alias de `label`). */
    text: {
        type: String as PropType<string | null>,
        default: null as string | null,
    },
    /** Color de fondo. */
    color: { type: String, default: 'bg-button' },
    /** Color del texto. */
    textColor: {
        type: String,
        default: 'text-ui',
    },
    /** Variante visual: 'default' | 'outlined' | 'flat' | 'pill'. */
    variant: {
        type: String as PropType<KunChipVariant>,
        default: 'default' as KunChipVariant,
        validator: (v: unknown): boolean => ['default', 'outlined', 'flat', 'pill'].includes(v as string),
    },
    /** Clickable (cursor pointer y hover). */
    clickable: {
        type: Boolean,
        default: true,
    },
    /** Muestra botón de cierre (emite `update:modelValue` y `click:close`). */
    closable: {
        type: Boolean,
        default: false,
    },
    /** Deshabilita el chip. */
    disabled: {
        type: Boolean,
        default: false,
    },
    /** Densidad del padding. */
    density: {
        type: String as PropType<KunChipDensity>,
        default: 'default' as KunChipDensity,
        validator: (v: unknown): boolean => ['default', 'comfortable', 'compact'].includes(v as string),
    },
    /** Ícono al inicio del chip. */
    prependIcon: {
        type: [String, Object, Function] as PropType<string | Record<string, unknown> | ((...args: never[]) => unknown) | null>,
        default: null,
    },
    /** Ícono al final del chip. */
    appendIcon: {
        type: [String, Object, Function] as PropType<string | Record<string, unknown> | ((...args: never[]) => unknown) | null>,
        default: null,
    },
    /** Ruta Vue Router (renderiza router-link). */
    to: {
        type: [String, Object] as PropType<string | Record<string, unknown> | null>,
        default: null,
    },
    /** URL externa (renderiza <a>). */
    href: {
        type: String as PropType<string | null>,
        default: null as string | null,
    },
    /** Navegación con replace (solo con `to`). */
    replace: {
        type: Boolean,
        default: false,
    },
    /** Target del enlace. */
    target: {
        type: String as PropType<string | null>,
        default: null as string | null,
    },
};
