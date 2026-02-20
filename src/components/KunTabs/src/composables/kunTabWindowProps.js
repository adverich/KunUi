export const kunTabWindowProps = {
  modelValue: [String, Number, Array],
  items: {
    type: Array,
    default: () => [],
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
