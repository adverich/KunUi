export const kunSkeletonProps = {
  /** Si es false muestra el slot default en vez del skeleton. */
  loading: { type: Boolean, default: true },
  /** Forma: 'rect' | 'circle' | 'text'. */
  variant: { type: String, default: "rect" },
  /** Ancho (número = px). */
  width: { type: [String, Number], default: "100%" },
  /** Altura (número = px). */
  height: { type: [String, Number], default: "1rem" },
  /** Redondeo. */
  rounded: { type: String, default: "md" },
  /** Animación: 'shimmer' | 'shimmer-vertical' | 'pulse' | 'none'. */
  animation: { type: String, default: "shimmer" },
  /** Duración de la animación en ms. */
  duration: { type: Number, default: 1500 },
  /** Color inicial del degradado. */
  colorFrom: { type: String, default: "bg-ui-surface-subtle" },
  /** Color final del degradado. */
  colorTo: { type: String, default: "bg-ui-hover" },
  /** Reservado para repetir el placeholder. Actualmente sin efecto. */
  repeat: { type: Boolean, default: true },
  /** Clase extra del placeholder. */
  class: { type: [String, Array, Object], default: "" }
}
