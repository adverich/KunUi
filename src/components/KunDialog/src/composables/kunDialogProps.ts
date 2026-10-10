import type { PropType } from 'vue';

export type KunDialogXPosition = 'start' | 'center' | 'end';
export type KunDialogYPosition = 'top' | 'center' | 'bottom';

export const kunDialogProps = {
  modelValue: Boolean,
  overlay: { type: Boolean, default: true },
  fullscreen: { type: Boolean, default: false },
  scrollable: { type: Boolean, default: false },
  persistent: { type: Boolean, default: false },
  dialogClass: { type: String, default: '' },
  xPosition: {
    type: String as PropType<KunDialogXPosition>,
    default: 'center',
    validator: (v: unknown) => ['start', 'center', 'end'].includes(v as string),
  },
  yPosition: {
    type: String as PropType<KunDialogYPosition>,
    default: 'center',
    validator: (v: unknown) => ['top', 'center', 'bottom'].includes(v as string),
  },
  contentClass: { type: String, default: '' },
  bgColor: { type: String, default: 'bg-surface-dark' },
  minHeight: { type: String, default: 'h-fit' },
  height: { type: String, default: 'h-fit' },
  maxHeight: { type: String, default: 'max-h-dvh' },
  minWidth: { type: String, default: 'min-w-1/3' },
  width: { type: String, default: 'w-full' },
  maxWidth: { type: String, default: 'max-w-full' },
}
