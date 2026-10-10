export const kunRadioGroupProps = {
  modelValue: [String, Number, Boolean, Object],
  color: String,
  baseColor: String,
  name: String,
  disabled: Boolean,
  readonly: Boolean,
  direction: { type: String, default: 'vertical' },
  inline: Boolean,
  error: Boolean,
  trueIcon: { type: [String, Object], default: 'mdi-radiobox-marked' },
  falseIcon: { type: [String, Object], default: 'mdi-radiobox-blank' },
  label: String,
}
