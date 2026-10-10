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
    validator: (v: unknown) => ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'].includes(v as string),
  },
  wrapperClass: {
    type: String,
    default: '',
  },
}
