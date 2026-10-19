import type { PropType } from 'vue';

export const kunListItemTitleProps = {
  /** Título a mostrar. */
  title: {
    type: [String, Number] as PropType<string | number | null>,
    default: null
  },
  /** Tamaño del texto. */
  fontSize: {
    type: String,
    default: 'text-lg'
  },
  /** Peso del texto. */
  fontWeight: {
    type: String,
    default: 'font-medium'
  }
}
