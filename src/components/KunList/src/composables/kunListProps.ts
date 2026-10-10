import type { PropType } from 'vue';

export type KunListSelectionMode = 'single' | 'multiple';

export const kunListProps = {
  nav: Boolean,
  sub: Boolean,
  dense: Boolean,
  selectable: { type: Boolean, default: false },
  selectionMode: {
    type: String as PropType<KunListSelectionMode>,
    default: 'single',
    validator: (v: unknown) => ['single', 'multiple'].includes(v as string),
  },
  bgList: { type: String, default: 'bg-transparent' },
  borderColor: { type: String, default: 'border-ui' }
}
