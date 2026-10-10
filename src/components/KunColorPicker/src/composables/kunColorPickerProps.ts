import type { PropType } from 'vue';

export type KunColorPickerColorType = 'hex' | 'rgb' | 'hsl' | 'all';

export const kunColorPickerProps = {
  /** Color seleccionado (v-model). Emite HEX opaco o `rgba()` con opacidad. */
  modelValue: { type: String, default: '#000000' },
  /** Color to restore with the reset action. Defaults to the initial model value. */
  originalColor: { type: String, default: null },
  /** Etiqueta del campo. */
  label: { type: String, default: '' },
  /** Deshabilita el control. */
  disabled: { type: Boolean, default: false },
  /** Habilita el selector transparente. */
  allowTransparent: { type: Boolean, default: true },
  /** Muestra la acción Restablecer. */
  resettable: { type: Boolean, default: true },
  /** Muestra las vistas previa original y seleccionada. */
  showPreview: { type: Boolean, default: true },
  /** 'hex', 'rgb', 'hsl', or 'all' (lets the user choose). */
  colorType: {
    type: String as PropType<KunColorPickerColorType>,
    default: 'all',
    validator: (value: unknown) => ['hex', 'rgb', 'hsl', 'all'].includes(value as string),
  },
  /** Placeholder del input de texto. */
  placeholder: { type: String, default: '#000000' },
}
