import type { PropType } from 'vue';

export type KunModalFooterColor = 'blue' | 'green' | 'red' | 'yellow' | 'gray' | 'orange';

export const kunModalFooterProps = {
  /** Visibilidad del mensaje (v-model, requerido). */
  modelValue: {
    type: Boolean,
    required: true,
  },
  /** Id del mensaje (se emite en `removeMessage`). */
  id: {
    type: [String, Number],
  },
  /** Texto del mensaje. */
  message: {
    type: String,
    default: "Mensaje predeterminado",
  },
  /** Color temático ('green' | 'blue' | 'red' | ...). */
  color: {
    type: String as PropType<KunModalFooterColor>,
    default: "green",
    validator: (v: unknown) => ['blue', 'green', 'red', 'yellow', 'gray', 'orange'].includes(v as string),
  },
  /** Ancho del contenedor. */
  width: {
    type: String,
    default: "300px",
  },
  /** Altura del contenedor ('auto' = contenido). */
  height: {
    type: String,
    default: "auto",
  },
  /** Posicionamiento fijo en viewport. */
  isFixed: {
    type: Boolean,
    default: false,
  },
}
