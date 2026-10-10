import type { PropType } from 'vue';

export type KunColorPickerColorType = 'hex' | 'rgb' | 'hsl' | 'all';

export const kunColorPickerProps = {
  modelValue: { type: String, default: '#000000' },
  /** Color to restore with the reset action. Defaults to the initial model value. */
  originalColor: { type: String, default: null },
  label: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  allowTransparent: { type: Boolean, default: true },
  resettable: { type: Boolean, default: true },
  showPreview: { type: Boolean, default: true },
  /** 'hex', 'rgb', 'hsl', or 'all' (lets the user choose). */
  colorType: {
    type: String as PropType<KunColorPickerColorType>,
    default: 'all',
    validator: (value: unknown) => ['hex', 'rgb', 'hsl', 'all'].includes(value as string),
  },
  placeholder: { type: String, default: '#000000' },
}
