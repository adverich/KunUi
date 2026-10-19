import type { PropType } from 'vue';
import { isKunColor, type KunColor } from '../../../../theme/kunVariants.js';

export type KunBadgePosition =
  | 'top left' | 'top center' | 'top right'
  | 'center left' | 'center center' | 'center right'
  | 'bottom left' | 'bottom center' | 'bottom right';

export const KUN_BADGE_POSITIONS: KunBadgePosition[] = [
  'top left', 'top center', 'top right',
  'center left', 'center center', 'center right',
  'bottom left', 'bottom center', 'bottom right',
];

export const kunBadgeProps = {
  /** Texto o número a mostrar dentro del badge. */
  text: { type: [String, Number], default: '' },
  /** Color semántico del badge. */
  color: {
    type: String as PropType<KunColor>,
    default: 'error' as KunColor,
    validator: (v: unknown) => isKunColor(v)
  },
  /** Tamaño del texto. */
  textSize: { type: String, default: 'text-xs' },
  /** Peso del texto. */
  fontWeight: { type: String, default: 'font-bold' },
  /** Redondeo: 'full' | 'none'. `null` = `rounded-sm` (redondeo propio de badge). */
  rounded: {
    type: String as PropType<'full' | 'none' | null>,
    default: null,
    validator: (v: unknown) => v === null || ['full', 'none'].includes(v as string)
  },
  /** Forma píldora (`rounded-full`). Por defecto el badge es `rounded-sm`. */
  pill: { type: Boolean, default: false },
  /** Modo punto (sin texto, solo indicador). */
  dot: { type: Boolean, default: false },
  /** Visibilidad del badge. */
  visible: { type: Boolean, default: true },
  /** Posición relativa al contenido envuelto ("vertical horizontal"). */
  position: {
    type: String as PropType<KunBadgePosition>,
    default: 'top right' as KunBadgePosition,
    validator: (val: unknown): boolean =>
      typeof val === 'string' && (KUN_BADGE_POSITIONS as string[]).includes(val),
  },
  /** Desplazamiento horizontal en px respecto a la posición. */
  ejeX: { type: [Number, String], default: 25 },
  /** Desplazamiento vertical en px respecto a la posición. */
  ejeY: { type: [Number, String], default: -15 },
  /** Cursor sobre el badge. */
  cursor: { type: String, default: 'cursor-default' },
};
