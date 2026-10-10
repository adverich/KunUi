export const kunTabProps = {
  /** Valor del tab (debe coincidir con el modelValue del grupo). */
  value: [String, Number],
  /** Texto del tab (alternativa al slot). */
  text: [String, Number],
  /** Ícono al inicio. */
  prependIcon: String,
  /** Ícono al final. */
  appendIcon: String,
  /** Deshabilita el tab. */
  disabled: Boolean,
  /** Ícono sobre el texto (layout vertical). */
  stacked: Boolean,
  /** Clase cuando está seleccionado. */
  selectedClass: {
    type: String,
    default: 'text-primary font-medium',
  },
  /** Color cuando no está seleccionado. */
  baseColor: {
    type: String,
    default: 'text-ui-muted',
  },
  /** Clase extra de color. */
  colorClass: {
    type: String,
    default: '',
  },
  /** Tag del contenedor. */
  tag: {
    type: String,
    default: 'button',
  },
  /** Ruta Vue Router (renderiza router-link). */
  to: [String, Object],
}
