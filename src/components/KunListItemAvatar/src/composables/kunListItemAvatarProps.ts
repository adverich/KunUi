import type { PropType } from 'vue';

export type KunListItemAvatarSize = 'sm' | 'md' | 'lg';

export const kunListItemAvatarProps = {
  /** Texto (iniciales) del avatar. */
  text: {
    type: [String, Number] as PropType<string | number | null>,
    default: null
  },
  /** Tamaño predefinido. */
  size: {
    type: String as PropType<KunListItemAvatarSize>,
    default: 'md',
    validator: (v: unknown) => ['sm', 'md', 'lg'].includes(v as string),
  },
  /** Redondeo. */
  rounded: {
    type: String,
    default: 'rounded-full'
  },
  /** Color de fondo. */
  bgColor: {
    type: String,
    default: 'bg-surface-light'
  },
  /** Color del texto. */
  textColor: {
    type: String,
    default: 'text-ui-inverse'
  },
  /** Peso del texto. */
  fontWeight: {
    type: String,
    default: 'font-medium'
  }
}
