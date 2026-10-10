import type { PropType } from 'vue';

export type KunBtnSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type KunBtnVariant = 'default' | 'tonal' | 'plain' | 'outlined' | 'soft' | 'text';
export type KunBtnType = 'button' | 'submit' | 'reset';

export const kunBtnProps = {
  text: String,
  size: {
    type: String as PropType<KunBtnSize>,
    default: 'md',
    validator: (v: unknown) => ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'].includes(v as string)
  },
  minWidth: { type: String, default: 'min-w-[3rem]' },
  fontWeight: { type: String, default: 'font-medium' },
  rounded: { type: String, default: 'rounded-lg' },
  textAlign: { type: String, default: 'text-center' },
  variant: {
    type: String as PropType<KunBtnVariant>,
    default: 'default',
    validator: (v: unknown) => ['default', 'tonal', 'plain', 'outlined', 'soft', 'text'].includes(v as string)
  },
  type: {
    type: String as PropType<KunBtnType>,
    default: 'button',
    validator: (v: unknown) => ['button', 'submit', 'reset'].includes(v as string)
  },
  disabled: Boolean,
  loading: Boolean,
  bgColor: { type: String, default: 'bg-button' },
  textColor: {
    type: String,
    default: 'text-ui'
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
