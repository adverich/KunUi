import type { PropType } from 'vue';

export const kunRadioProps = {
  /** Valor seleccionado del grupo (v-model del KunRadioGroup). Acepta `null` (nada seleccionado). */
  modelValue: { type: [String, Number, Boolean, Object] as PropType<string | number | boolean | Record<string, unknown> | null> },
  /** Etiqueta al lado del radio. */
  label: String,
  /** Color cuando está seleccionado. */
  color: String,
  /** Color base cuando no está seleccionado. */
  baseColor: String,
  /** Valor que representa el estado activo. */
  trueValue: { default: true },
  /** Valor que representa el estado inactivo. */
  falseValue: { default: false },
  /** Ícono personalizado para el estado activo. */
  trueIcon: { type: [String, Object], default: null },
  /** Ícono personalizado para el estado inactivo. */
  falseIcon: { type: [String, Object], default: null },
  /** Valor de esta opción. */
  value: [String, Number, Boolean, Object],
  /** Deshabilita la opción. */
  disabled: Boolean,
  /** Solo lectura. */
  readonly: Boolean,
  /** Estado de error visual. */
  error: Boolean,
  /** Nombre del grupo (input nativo). */
  name: String,
  /** Id del input nativo. */
  id: String,
}
