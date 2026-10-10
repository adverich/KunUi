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
    type: String,
    default: "green",
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
