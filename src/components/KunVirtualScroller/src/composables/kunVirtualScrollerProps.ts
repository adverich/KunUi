import type { PropType } from 'vue';

export const kunVirtualScrollerProps = {
  /** Lista completa a virtualizar (requerido). */
  items: {
    type: Array as PropType<unknown[]>,
    required: true as const,
  },
  /** Altura estimada por ítem en px (para el cálculo inicial). */
  estimatedItemHeight: {
    type: Number,
    default: 48,
  },
  /** Ítems extra renderizados fuera del viewport. */
  buffer: {
    type: Number,
    default: 5,
  },
  /** Desplaza hasta este índice. */
  scrollToIndex: {
    type: Number as PropType<number | null>,
    default: null,
  },
}
