import type { PropType } from 'vue';

export const kunCardTextProps = {
    /** Texto del cuerpo (alternativa al slot). */
    text: { type: [String, Number] as PropType<string | number | null>, default: null },
    /** Color del texto. */
    color: { type: String, default: 'text-default' },
    /** Reduce el padding. */
    dense: { type: Boolean, default: false },
    /** Opacidad del texto. */
    opacity: { type: String, default: 'opacity-100' },
    /** Tag del contenedor. */
    tag: { type: String, default: 'div' }
}
