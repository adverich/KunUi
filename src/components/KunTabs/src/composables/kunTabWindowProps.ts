import type { PropType } from 'vue';

export interface KunTabWindowItem {
  value: string | number;
  [key: string]: unknown;
}

export const kunTabWindowProps = {
  /** Contenido visible (v-model): valor del tab o array con `multiple`. */
  modelValue: [String, Number, Array],
  /** Ventanas generadas por datos `{ value, ... }` (slots `item.<value>`). */
  items: {
    type: Array as PropType<KunTabWindowItem[]>,
    default: (): KunTabWindowItem[] => [],
  },
  /** Muestra el contenido (también controla la transición). */
  show: {
    type: Boolean,
    default: true,
  },
  /** Clase de la ventana seleccionada. */
  selectedClass: {
    type: String,
    default: 'border-b-2 border-primary',
  },
  /** Tag del contenedor. */
  tag: {
    type: String,
    default: 'div',
  },
  /** Nombre de la transición entre ventanas. */
  transition: {
    type: [String, Object],
    default: 'fade',
  },
  /** Muestra varias ventanas a la vez (array en modelValue). */
  multiple: {
    type: Boolean,
    default: false,
  },
}
