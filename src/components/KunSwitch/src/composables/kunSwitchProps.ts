import type { PropType } from 'vue';

export type KunSwitchSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type KunSwitchLabelPosition = 'top' | 'bottom' | 'left' | 'right';

export const kunSwitchProps = {
  /** Estado (v-model). */
  modelValue: { type: [Boolean, String, Number], default: false },
  /** Valor que representa el estado activo. */
  trueValue: { type: [Boolean, String, Number], default: true },
  /** Valor que representa el estado inactivo. */
  falseValue: { type: [Boolean, String, Number], default: false },
  /** Etiqueta al lado del switch. */
  label: String,
  /** Posición de la etiqueta: 'top' | 'bottom' | 'left' | 'right'. */
  labelPosition: {
    type: String as PropType<KunSwitchLabelPosition>,
    default: 'right',
    validator: (v: unknown) => ['top', 'bottom', 'left', 'right'].includes(v as string),
  },
  /** Deshabilita el switch. */
  disabled: Boolean,
  /** Color del track en estado activo. */
  onColor: { type: String, default: 'bg-success' },
  /** Color del track en estado inactivo. */
  offColor: { type: String, default: 'bg-accented' },
  /** Color del thumb. */
  iconColor: { type: String, default: 'bg-inverted' },
  /** Thumb hundido en el track. */
  inset: Boolean,
  /** Oculta el área de detalles. */
  hideDetails: { type: Boolean, default: false },
  /** Tamaño: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'. */
  size: {
    type: String as PropType<KunSwitchSize>,
    default: 'md',
    validator: (val: unknown) => ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'].includes(val as string),
  },
}
