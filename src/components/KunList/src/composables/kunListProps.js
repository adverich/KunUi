export const kunListProps = {
  nav: Boolean,
  sub: Boolean,
  dense: Boolean,
  selectable: { type: Boolean, default: false },
  selectionMode: {
    type: String,
    default: 'single',
    validator: v => ['single', 'multiple'].includes(v),
  },
  bgList: { type: String, default: 'bg-transparent' },
  borderColor: { type: String, default: 'border-gray-300 dark:border-gray-700' }
}
