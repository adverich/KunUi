export const kunSwitchProps = {
  modelValue: { type: [Boolean, String, Number], default: false },
  trueValue: { type: [Boolean, String, Number], default: true },
  falseValue: { type: [Boolean, String, Number], default: false },
  label: String,
  labelPosition: { type: String, default: 'right' },
  disabled: Boolean,
  onColor: { type: String, default: 'bg-green-600' },
  offColor: { type: String, default: 'bg-surface-light' },
  iconColor: { type: String, default: 'bg-white' },
  inset: Boolean,
  hideDetails: { type: Boolean, default: false },
  size: {
    type: String,
    default: 'md',
    validator: (val) => ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'].includes(val),
  },
}
