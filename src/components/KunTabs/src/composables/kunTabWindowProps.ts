import type { PropType } from 'vue';

export interface KunTabWindowItem {
  value: string | number;
  [key: string]: unknown;
}

export const kunTabWindowProps = {
  modelValue: [String, Number, Array],
  items: {
    type: Array as PropType<KunTabWindowItem[]>,
    default: (): KunTabWindowItem[] => [],
  },
  show: {
    type: Boolean,
    default: true,
  },
  selectedClass: {
    type: String,
    default: 'border-b-2 border-primary',
  },
  tag: {
    type: String,
    default: 'div',
  },
  transition: {
    type: [String, Object],
    default: 'fade',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
}
