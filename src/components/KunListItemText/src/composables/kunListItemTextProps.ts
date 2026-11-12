import type { PropType } from 'vue';

export const kunListItemTextProps = {
  /** Texto a mostrar. */
  text: {
    type: [String, Number] as PropType<string | number | null>,
    default: null
  },
  /** Tamaño del texto. */
  fontSize: {
    type: String,
    default: 'text-sm'
  },
  /** Peso del texto. */
  fontWeight: {
    type: String,
    default: 'font-medium'
  }
}
