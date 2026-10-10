export const kunTooltipProps = {
  /** Clase extra del tooltip. */
  class: [String, Array, Object],
  /** Id del tooltip (se genera uno si se omite). */
  id: { type: String, default: null },
  /** Texto del tooltip (alternativa al slot). */
  text: String,
  /** Posición respecto al activador: 'top' | 'bottom' | 'left' | 'right'. */
  location: { type: String, default: 'top' },
  /** Cómo se abre: 'hover' | 'click' | 'focus'. */
  openOn: { type: String, default: 'hover' },
  /** Transición de entrada/salida. */
  transition: { type: String, default: 'fade' },
  /** Deshabilita el tooltip. */
  disabled: Boolean,
  /** Retraso en ms antes de mostrar. */
  delay: { type: [Number, String], default: 0 },
  /** Retraso en ms antes de ocultar. */
  closeDelay: { type: [Number, String], default: 100 },
  /** Color del texto. */
  textColor: { type: String, default: 'text-ui' },
  /** Color de fondo. */
  bgColor: { type: String, default: 'bg-surface-dark' },
  /** Redondeo. */
  rounded: { type: String, default: 'rounded' },
  /** Tamaño del texto. */
  textSize: { type: String, default: 'text-sm' },
  /** Offset extra `{ x, y }` o número (solo `y`). */
  dist: { type: [Number, Object], default: () => ({ x: 0, y: 8 }) },
  /** Voltea al lado opuesto si no hay espacio. */
  flip: { type: Boolean, default: true },
}
