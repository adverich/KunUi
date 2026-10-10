export const kunMultipleModalFooterProps = {
  /** Lista de mensajes `{ id, text, color }` a mostrar apilados. */
  messages: {
    type: Array,
    default: () => [],
  },
  /** Esquina del viewport donde se apilan. */
  position: {
    type: String,
    default: "bottom-right",
  },
  /** Dirección de apilado: 'bottom-to-top' | 'top-to-bottom'. */
  stackDirection: {
    type: String,
    default: "bottom-to-top",
  },
  /** Ancho de cada mensaje. */
  width: {
    type: String,
    default: "300px",
  },
  /** Altura de cada mensaje ('auto' = contenido). */
  height: {
    type: String,
    default: "auto",
  },
}
