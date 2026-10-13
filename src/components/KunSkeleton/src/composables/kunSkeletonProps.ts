import type { PropType } from 'vue';

export type KunSkeletonVariant = 'rect' | 'circle' | 'text';
export type KunSkeletonAnimation = 'shimmer' | 'shimmer-vertical' | 'wave' | 'pulse' | 'none';

export const kunSkeletonProps = {
  /** Si es false muestra el slot default en vez del skeleton. */
  loading: { type: Boolean, default: true },
  /** Forma: 'rect' (bloque con redondeo configurable) | 'text' (píldora) | 'circle' (círculo perfecto, fuerza tamaño cuadrado). */
  variant: {
    type: String as PropType<KunSkeletonVariant>,
    default: "rect",
    validator: (v: unknown) => ["rect", "circle", "text"].includes(v as string),
  },
  /** Ancho (número = px). En 'circle' define el diámetro, salvo porcentaje (usa height). */
  width: { type: [String, Number], default: "100%" },
  /** Altura (número = px). En 'circle' solo se usa si width es porcentaje. */
  height: { type: [String, Number], default: "1rem" },
  /** Redondeo. */
  rounded: { type: String, default: "md" },
  /** Animación: 'shimmer' (barrido con pausa) | 'shimmer-vertical' (barrido vertical) | 'wave' (oscilación continua) | 'pulse' (pulso de opacidad) | 'none' (estático). */
  animation: {
    type: String as PropType<KunSkeletonAnimation>,
    default: "shimmer",
    validator: (v: unknown) => ["shimmer", "shimmer-vertical", "wave", "pulse", "none"].includes(v as string),
  },
  /** Duración de la animación en ms. Se aplica a todas las animaciones. */
  duration: { type: Number, default: 1600 },
  /** Clase de fondo base del placeholder. */
  colorFrom: { type: String, default: "bg-ui-hover" },
  /** Reservado para compatibilidad. Actualmente sin efecto (el brillo deriva de la superficie elevada). */
  colorTo: { type: String, default: "bg-ui-hover" },
  /** Reservado para repetir el placeholder. Actualmente sin efecto. */
  repeat: { type: Boolean, default: true },
  /** Clase extra del placeholder. */
  class: { type: [String, Array, Object], default: "" }
}
