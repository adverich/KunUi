import type { PropType } from 'vue';

export type KunCardRounded = boolean | 'sm' | 'md' | 'lg' | 'xl';
export type KunCardElevation = '' | '0' | '1' | '2' | '3' | '4' | '5' | 0 | 1 | 2 | 3 | 4 | 5;
export type KunCardDensity = 'default' | 'comfortable' | 'compact';

export const kunCardProps = {
    /** Título (atajo; equivale al slot de título). */
    title: { type: String, default: null },
    /** Tamaño del título. */
    titleSize: { type: String, default: null },
    /** Subtítulo (atajo). */
    subtitle: { type: String, default: null },
    /** Reservado. Actualmente sin efecto (no se propaga a KunCardTitle). */
    subTitleSize: { type: String, default: null },
    /** Texto del cuerpo (atajo; equivale al slot default). */
    text: { type: String, default: null },
    /** Color del texto. */
    textColor: { type: String, default: 'text-ui' },
    /** Color de fondo. */
    bgColor: { type: String, default: 'bg-transparent' },
    /** Sin sombra. */
    flat: { type: Boolean, default: false },
    /** Redondeo: boolean o tamaño. */
    rounded: {
        type: [Boolean, String] as PropType<KunCardRounded>,
        default: true,
        validator: (v: unknown) => typeof v === 'boolean' || ['sm', 'md', 'lg', 'xl'].includes(v as string)
    },
    /** Con borde (usa `outlineColor`). */
    outlined: { type: Boolean, default: false },
    /** Color del borde en modo `outlined`. */
    outlineColor: { type: String, default: 'border-ui' },
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
    /** Deshabilita interacción. */
    disabled: { type: Boolean, default: false },
    /** Efecto ripple al hacer click. */
    ripple: { type: Boolean, default: true },
    /** Variante visual. */
    variant: { type: String, default: 'elevated' },
    /** Altura fija (clase Tailwind). */
    height: { type: String, default: null },
    /** Ancho fijo (clase Tailwind). */
    width: { type: String, default: null },
    /** Altura máxima. */
    maxHeight: { type: String, default: null },
    /** Ancho máximo. */
    maxWidth: { type: String, default: null },
    /** Altura mínima. */
    minHeight: { type: String, default: null },
    /** Ancho mínimo. */
    minWidth: { type: String, default: null },
    /** Posicionamiento (clase Tailwind). */
    position: { type: String, default: null },
    /** Ícono al inicio del header. */
    prependIcon: { type: String, default: null },
    /** Ícono al final del header. */
    appendIcon: { type: String, default: null },
    /** Avatar al inicio del header (URL de imagen). */
    prependAvatar: { type: String, default: null },
    /** Avatar al final del header (URL de imagen). */
    appendAvatar: { type: String, default: null },
    /** Imagen superior del card (URL). */
    image: { type: String, default: null },
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
    /** Coincidencia exacta de ruta (solo con `to`, se pasa al router-link). */
    exact: { type: Boolean, default: false },
    /** Sombra al pasar el mouse. */
    hover: { type: Boolean, default: false },
    /** Contenido con scroll interno. */
    scrollable: { type: Boolean, default: false }
}
