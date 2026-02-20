export const kunToolbarItemsProps = {
  color: String,
  variant: {
    type: String,
    default: 'text',
    validator: (v) =>
      ['flat', 'text', 'elevated', 'tonal', 'outlined', 'plain'].includes(v),
  },
}
