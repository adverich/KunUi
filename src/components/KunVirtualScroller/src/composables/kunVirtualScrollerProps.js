export const kunVirtualScrollerProps = {
  items: {
    type: Array,
    required: true,
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
    type: Number,
    default: null,
  },
}
