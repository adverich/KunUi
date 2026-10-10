import type { PropType } from 'vue';

export type KunAlertPosition =
  | 'tl' | 'tc' | 'tr'
  | 'cl' | 'cc' | 'cr'
  | 'bl' | 'bc' | 'br';

export const kunAlertProps = {
  modelValue: Boolean,
  title: String,
  message: String,
  position: {
    type: String as PropType<KunAlertPosition>,
    default: 'br',
    validator: (v: unknown) => [
      'tl', 'tc', 'tr',
      'cl', 'cc', 'cr',
      'bl', 'bc', 'br'
    ].includes(v as string)
  },
  icon: { type: String, default: null },
  iconSize: { type: String, default: 'text-2xl' },
  iconBgColor: { type: String, default: 'bg-error' },
  bgColor: { type: String, default: 'bg-error' },
  textColor: { type: String, default: 'text-ui-inverse' },
  borderColor: { type: String, default: '' },
  titleClass: { type: String, default: 'text-2xl font-bold' },
  messageClass: { type: String, default: 'text-base font-normal' },
  closable: { type: Boolean, default: false },
  zIndex: { type: [String, Number], default: 2500 },
  transition: { type: String, default: 'transition-opacity duration-300 ease-in-out' },
  alertClass: { type: String, default: 'relative w-fit rounded-lg shadow-md' },
  paddingContainer: { type: String, default: 'p-2' },
  margin: { type: String, default: 'm-2' },
  fullscreen: { type: Boolean, default: false },
  persistent: { type: Boolean, default: false },
  persistentLabel: { type: String, default: 'Aceptar' },
  actionLabel: { type: String, default: '' },
  timeout: { type: Number, default: 2500 }
}
