export const kunBtnProps = {
  text: String,
  size: {
    type: String,
    default: 'md',
    validator: v => ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'].includes(v)
  },
  minWidth: { type: String, default: 'min-w-[3rem]' },
  fontWeight: { type: String, default: 'font-medium' },
  rounded: { type: String, default: 'rounded-lg' },
  textAlign: { type: String, default: 'text-center' },
  variant: {
    type: String,
    default: 'default',
    validator: v => ['default', 'tonal', 'plain', 'outlined', 'soft', 'text'].includes(v)
  },
  disabled: Boolean,
  loading: Boolean,
  bgColor: { type: String, default: 'bg-button' },
  textColor: {
    type: String,
    default: 'text-slate-800 dark:text-slate-200'
  },
  to: [String, Object],
  href: String,
  replace: Boolean,
  target: String,
  ring: Boolean,
  icon: [Boolean, String, Function, Object, Array],
  prependIcon: [String, Function, Object, Array],
  appendIcon: [String, Function, Object, Array],
  iconSize: { type: String, default: null },
  focusColor: { type: String, default: null }
}
