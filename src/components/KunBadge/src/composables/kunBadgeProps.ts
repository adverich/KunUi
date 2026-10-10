import type { PropType } from 'vue';

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
  /** Color de fondo del badge. */
  bgColor: { type: String, default: 'bg-error' },
  /** Color del texto. */
  textColor: { type: String, default: 'text-black dark:text-white' },
  /** Tamaño del texto. */
  textSize: { type: String, default: 'text-xs' },
  /** Peso del texto. */
  fontWeight: { type: String, default: 'font-bold' },
  /** Redondeo del badge. */
  rounded: { type: String, default: 'rounded-full' },
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
