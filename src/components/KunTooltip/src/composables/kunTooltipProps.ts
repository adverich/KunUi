import type { PropType } from 'vue';

export type KunTooltipLocation = 'top' | 'bottom' | 'left' | 'right';
export type KunTooltipOpenOn = 'hover' | 'click' | 'focus';

export const kunTooltipProps = {
  /** Clase extra del tooltip. */
  class: [String, Array, Object],
  /** Id del tooltip (se genera uno si se omite). */
  id: { type: String as PropType<string | null>, default: null },
  /** Texto del tooltip (alternativa al slot). */
  text: String,
  /** Posición respecto al activador: 'top' | 'bottom' | 'left' | 'right'. */
  location: {
    type: String as PropType<KunTooltipLocation>,
    default: 'top',
    validator: (v: unknown) => ['top', 'bottom', 'left', 'right'].includes(v as string),
  },
  /** Cómo se abre: 'hover' | 'click' | 'focus'. */
  openOn: {
    type: String as PropType<KunTooltipOpenOn>,
    default: 'hover',
    validator: (v: unknown) => ['hover', 'click', 'focus'].includes(v as string),
  },
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
  /** Offset extra `{ x, y }` o número (simétrico: aplica a `x` e `y`). */
  dist: { type: [Number, Object], default: () => ({ x: 0, y: 8 }) },
  /** Voltea al lado opuesto si no hay espacio. */
  flip: { type: Boolean, default: true },
}
