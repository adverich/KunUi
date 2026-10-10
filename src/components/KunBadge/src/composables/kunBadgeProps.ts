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
  text: { type: [String, Number], default: '' },
  bgColor: { type: String, default: 'bg-error' },
  textColor: { type: String, default: 'text-black dark:text-white' },
  textSize: { type: String, default: 'text-xs' },
  fontWeight: { type: String, default: 'font-bold' },
  rounded: { type: String, default: 'rounded-full' },
  dot: { type: Boolean, default: false },
  visible: { type: Boolean, default: true },
  position: {
    type: String as PropType<KunBadgePosition>,
    default: 'top right' as KunBadgePosition,
    validator: (val: unknown): boolean =>
      typeof val === 'string' && (KUN_BADGE_POSITIONS as string[]).includes(val),
  },
  ejeX: { type: [Number, String], default: 25 },
  ejeY: { type: [Number, String], default: -15 },
  cursor: { type: String, default: 'cursor-default' },
};
