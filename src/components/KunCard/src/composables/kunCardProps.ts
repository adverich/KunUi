import type { PropType } from 'vue';
import { isKunColor, isKunVariant, type KunColor, type KunVariant } from '../../../../theme/kunVariants.js';

export type KunCardRounded = boolean | 'sm' | 'md' | 'lg' | 'xl';
export type KunCardElevation = '' | '0' | '1' | '2' | '3' | '4' | '5' | 0 | 1 | 2 | 3 | 4 | 5;
export type KunCardDensity = 'default' | 'comfortable' | 'compact';
export type KunCardVariant = KunVariant;

export const kunCardProps = {
    /** Título (atajo; equivale al slot de título). */
    title: { type: String as PropType<string | null>, default: null },
    /** Tamaño del título. */
    titleSize: { type: String as PropType<string | null>, default: null },
    /** Subtítulo (atajo). */
    subtitle: { type: String as PropType<string | null>, default: null },
    /** Reservado. Actualmente sin efecto (no se propaga a KunCardTitle). */
    subTitleSize: { type: String as PropType<string | null>, default: null },
    /** Texto del cuerpo (atajo; equivale al slot default). */
    text: { type: String as PropType<string | null>, default: null },
    /** Redondeo: boolean o tamaño. */
    rounded: {
        type: [Boolean, String] as PropType<KunCardRounded>,
        default: true,
        validator: (v: unknown) => typeof v === 'boolean' || ['sm', 'md', 'lg', 'xl'].includes(v as string)
    },
    /** Nivel de sombra (0-5, como string o número). */
    elevation: {
        type: [String, Number] as PropType<KunCardElevation>,
        default: 1,
        validator: (v: unknown) => ['0', '1', '2', '3', '4', '5', '', 0, 1, 2, 3, 4, 5].includes(v as string)
    },
    /** Ruta Vue Router (renderiza router-link). */
    to: [String, Object],
    /** URL externa (renderiza <a>). */
    href: String,
    /** Navegación con replace (solo con `to`). */
    replace: Boolean,

    // Nuevos props
    /** Tag del contenedor. */
    tag: { type: String, default: 'div' },
    /** Color semántico de la superficie; `null` hereda `kunTheme.configure({ defaults: { card } })` (fallback `neutral`). */
    color: { type: String as PropType<KunColor | null>, default: null, validator: (v: unknown) => v === null || isKunColor(v) },
    /** Variante estándar de superficie (`KunVariant`); `null` hereda theme (`card`, fallback `solid`). */
    variant: {
        type: String as PropType<KunVariant | null>,
        default: null,
        validator: (v: unknown) => v === null || isKunVariant(v),
    },
    /** Deshabilita interacción. */
    disabled: { type: Boolean, default: false },
    /** Efecto ripple al hacer click. */
    ripple: { type: Boolean, default: true },
    /** Altura fija (clase Tailwind). */
    height: { type: String as PropType<string | null>, default: null },
    /** Ancho fijo (clase Tailwind). */
    width: { type: String as PropType<string | null>, default: null },
    /** Altura máxima. */
    maxHeight: { type: String as PropType<string | null>, default: null },
    /** Ancho máximo. */
    maxWidth: { type: String as PropType<string | null>, default: null },
    /** Altura mínima. */
    minHeight: { type: String as PropType<string | null>, default: null },
    /** Ancho mínimo. */
    minWidth: { type: String as PropType<string | null>, default: null },
    /** Posicionamiento (clase Tailwind). */
    position: { type: String as PropType<string | null>, default: null },
    /** Ícono al inicio del header. */
    prependIcon: { type: String as PropType<string | null>, default: null },
    /** Ícono al final del header. */
    appendIcon: { type: String as PropType<string | null>, default: null },
    /** Avatar al inicio del header (URL de imagen). */
    prependAvatar: { type: String as PropType<string | null>, default: null },
    /** Avatar al final del header (URL de imagen). */
    appendAvatar: { type: String as PropType<string | null>, default: null },
    /** Imagen superior del card (URL). */
    image: { type: String as PropType<string | null>, default: null },
    /** Muestra indicador de carga. */
    loading: { type: Boolean, default: false },
    /** Densidad del padding interno. */
    density: {
        type: String as PropType<KunCardDensity>,
        default: 'default',
        validator: (v: unknown) => ['default', 'comfortable', 'compact'].includes(v as string)
    },
    /** Sin bordes redondeados. */
    tile: { type: Boolean, default: false },
    /** Sombra al pasar el mouse. */
    hover: { type: Boolean, default: false },
    /** Contenido con scroll interno. */
    scrollable: { type: Boolean, default: false }
}
