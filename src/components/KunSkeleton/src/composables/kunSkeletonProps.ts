import type { PropType } from 'vue';

export type KunSkeletonVariant = 'rect' | 'circle' | 'text';
export type KunSkeletonAnimation = 'shimmer' | 'shimmer-vertical' | 'pulse' | 'none';

export const kunSkeletonProps = {
  /** Si es false muestra el slot default en vez del skeleton. */
  loading: { type: Boolean, default: true },
  /** Forma: 'rect' | 'circle' | 'text'. */
  variant: {
    type: String as PropType<KunSkeletonVariant>,
    default: "rect",
    validator: (v: unknown) => ["rect", "circle", "text"].includes(v as string),
  },
  /** Ancho (número = px). */
  width: { type: [String, Number], default: "100%" },
  /** Altura (número = px). */
  height: { type: [String, Number], default: "1rem" },
  /** Redondeo. */
  rounded: { type: String, default: "md" },
  /** Animación: 'shimmer' | 'shimmer-vertical' | 'pulse' | 'none'. */
  animation: {
    type: String as PropType<KunSkeletonAnimation>,
    default: "shimmer",
    validator: (v: unknown) => ["shimmer", "shimmer-vertical", "pulse", "none"].includes(v as string),
  },
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
