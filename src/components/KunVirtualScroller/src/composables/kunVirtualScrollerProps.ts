import type { PropType } from 'vue';

export const kunVirtualScrollerProps = {
  items: {
    type: Array as PropType<unknown[]>,
    required: true as const,
  },
  estimatedItemHeight: {
    type: Number,
    default: 48,
  },
  buffer: {
    type: Number,
    default: 5,
  },
  scrollToIndex: {
    type: Number as PropType<number | null>,
    default: null,
  },
}
