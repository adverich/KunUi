export const kunDragAndDropHandleProps = {
  disabled: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: 'Arrastrar',
  },
  size: {
    type: String,
    default: 'xs',
    validator: (v) => ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'].includes(v),
  },
  wrapperClass: {
    type: String,
    default: '',
  },
}
