export const kunTabProps = {
  value: [String, Number],
  text: [String, Number],
  prependIcon: String,
  appendIcon: String,
  disabled: Boolean,
  stacked: Boolean,
  selectedClass: {
    type: String,
    default: 'text-primary font-medium',
  },
  baseColor: {
    type: String,
    default: 'text-slate-500 dark:text-slate-300',
  },
  colorClass: {
    type: String,
    default: '',
  },
  tag: {
    type: String,
    default: 'button',
  },
  to: [String, Object],
}
