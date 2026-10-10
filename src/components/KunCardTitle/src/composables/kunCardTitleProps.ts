// kunCardTitleProps.js
import type { PropType } from 'vue';

export const kunCardTitleProps = {
    /** Título (alternativa al slot). */
    title: String,
    /** Tamaño del título. */
    titleSize: String,
    /** Subtítulo (alternativa al slot). */
    subtitle: String,
    /** Contenido al inicio (componente o icono). */
    prepend: [String, Object, Function],
    /** Contenido al final (componente o icono). */
    append: [String, Object, Function],
    /** Color de fondo. */
    bgColor: {
        type: String,
        default: 'bg-transparent'
    },
    /** Color del texto. */
    textColor: {
        type: String,
        default: 'text-ui'
    },
    /** Reduce el padding. */
    dense: {
        type: Boolean,
        default: false
    },
    /** Sin sombra. */
    flat: {
        type: Boolean,
        default: false
    },
    /** Redondeo: boolean o tamaño. */
    rounded: {
        type: [Boolean, String] as PropType<boolean | 'sm' | 'md' | 'lg' | 'xl'>,
        default: false,
        validator: (v: unknown) => typeof v === 'boolean' || ['sm', 'md', 'lg', 'xl'].includes(v as string)
    },
    /** Altura fija. */
    height: {
        type: [String, Number],
        default: 'auto'
    },
    /** Ancho fijo. */
    width: {
        type: [String, Number],
        default: 'full'
    }
}
