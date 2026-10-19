import type { PropType } from 'vue';

export const kunListItemSubtitleProps = {
  /** Texto del subtítulo. */
  text: {
    type: [String, Number] as PropType<string | number | null>,
    default: null
  },
  /** Tamaño del texto. */
  fontSize: {
    type: String,
    default: 'text-xs'
  },
  /** Peso del texto. */
  fontWeight: {
    type: String,
    default: 'font-medium'
  }
}
