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
  /** Redondeo: 'full' | 'none'. `null` = circular (propio de avatar). */
  rounded: {
    type: String as PropType<'full' | 'none' | null>,
    default: null,
    validator: (v: unknown) => v === null || ['full', 'none'].includes(v as string)
  },
  /** Peso del texto. */
  fontWeight: {
    type: String,
    default: 'font-medium'
  }
}
