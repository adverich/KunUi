import type { PropType } from 'vue';

export type KunSwitchSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type KunSwitchLabelPosition = 'top' | 'bottom' | 'left' | 'right';

export const kunSwitchProps = {
  modelValue: { type: [Boolean, String, Number], default: false },
  trueValue: { type: [Boolean, String, Number], default: true },
  falseValue: { type: [Boolean, String, Number], default: false },
  label: String,
  labelPosition: { type: String as PropType<KunSwitchLabelPosition>, default: 'right' },
  disabled: Boolean,
  onColor: { type: String, default: 'bg-success' },
  offColor: { type: String, default: 'bg-surface-light' },
  iconColor: { type: String, default: 'bg-ui-surface-raised' },
  inset: Boolean,
  hideDetails: { type: Boolean, default: false },
  size: {
    type: String as PropType<KunSwitchSize>,
    default: 'md',
    validator: (val: unknown) => ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'].includes(val as string),
  },
}
