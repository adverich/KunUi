import type { PropType } from 'vue';

export type KunToolbarItemsVariant = 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain';

export const kunToolbarItemsProps = {
  color: String,
  variant: {
    type: String as PropType<KunToolbarItemsVariant>,
    default: 'text',
    validator: (v: unknown) =>
      ['flat', 'text', 'elevated', 'tonal', 'outlined', 'plain'].includes(v as string),
  },
}
