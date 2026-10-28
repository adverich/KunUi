// kunCardTitleProps.js
import type { PropType } from 'vue';

export const kunCardTitleProps = {
    /** Título (alternativa al slot). */
    title: String as PropType<string | null>,
    /** Tamaño del título. */
    titleSize: String as PropType<string | null>,
    /** Subtítulo (alternativa al slot). */
    subtitle: String as PropType<string | null>,
    /** Contenido al inicio (componente o icono). */
    prepend: [String, Object, Function],
    /** Contenido al final (componente o icono). */
    append: [String, Object, Function],
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
