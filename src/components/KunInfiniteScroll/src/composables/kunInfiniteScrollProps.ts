import type { PropType } from 'vue';

export const kunInfiniteScrollProps = {
  items: { type: Array as PropType<unknown[]>, default: () => [] as unknown[] },
  search: String,
  searchableKeys: {
    type: Array,
    default: () => [],
  },
  itemsPerIntersection: {
    type: Number,
    default: 20,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  rootMargin: {
    type: String,
    default: '0px',
  },
  virtual: {
    type: Boolean,
    default: false,
  },
  itemSize: {
    type: Number,
    default: 48,
  },
  scrollToIndex: {
    type: Number as PropType<number | null>,
    default: null,
  }
}
