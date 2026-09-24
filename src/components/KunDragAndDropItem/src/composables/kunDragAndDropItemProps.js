export const kunDragAndDropItemProps = {
  item: {
    type: [Object, String, Number],
    default: null,
  },
  itemKey: {
    type: [String, Number],
    default: null,
  },
  index: {
    type: Number,
    default: 0,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  tag: {
    type: String,
    default: 'div',
  },
  wrapperClass: {
    type: String,
    default: '',
  },
}
