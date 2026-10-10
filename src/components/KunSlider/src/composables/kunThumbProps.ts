export const kunThumbProps = {
  /** Valor actual del thumb. */
  value: Number,
  /** Estilos de posición calculados por el slider. */
  thumbStyle: Object,
  /** Muestra el valor sobre el thumb. */
  thumbLabel: Boolean,
  /** Color del thumb. */
  thumbColor: {
    type: String,
    default: 'bg-primary'
  },
  /** Valor mínimo (accesibilidad y teclado). */
  min: {
    type: Number,
    default: 0
  },
  /** Valor máximo (accesibilidad y teclado). */
  max: {
    type: Number,
    default: 100
  },
  /** Paso de las flechas del teclado. */
  step: {
    type: Number,
    default: 1
  }
}
