import type { PropType } from 'vue';
import { isKunColor, isKunVariant, type KunColor, type KunVariant } from '../../../../theme/kunVariants.js';

export type KunChipDensity = 'default' | 'comfortable' | 'compact';
export type KunChipRounded = 'full' | 'none';

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
    /** Color semántico. `null` delega al theme global. */
    color: {
        type: String as PropType<KunColor | null>,
        default: null,
        validator: (v: unknown) => v === null || isKunColor(v),
    },
    /** Variante visual: 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost' | 'link'. `null` delega al theme global. */
    variant: {
        type: String as PropType<KunVariant | null>,
        default: null,
        validator: (v: unknown): boolean => v === null || isKunVariant(v),
    },
    /** Reservado. El chip es siempre `rounded-full` (forma píldora), sin efecto. */
    pill: {
        type: Boolean,
        default: false,
    },
    /** `full` = círculo 1:1; `none` = esquinas rectas; `null` = píldora por defecto. */
    rounded: {
        type: String as PropType<KunChipRounded | null>,
        default: null,
        validator: (v: unknown) => v === null || ['full', 'none'].includes(v as string),
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
