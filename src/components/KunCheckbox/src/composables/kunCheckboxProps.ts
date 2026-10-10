import type { PropType } from 'vue';

export const kunCheckboxProps = {
  /** Valor del checkbox (v-model). En modo `multiple` es el array de seleccionados. Acepta `null` (sin valor). */
  modelValue: { type: [Boolean, Array, String, Number, Object] as PropType<boolean | unknown[] | string | number | Record<string, unknown> | null> },
  /** Valor que representa el estado activo. */
  trueValue: { type: null, default: true },
  /** Valor que representa el estado inactivo. */
  falseValue: { type: null, default: false },
  /** Valor de esta opción (para grupos con `multiple`). */
  value: null,
  /** Estado indeterminado (guion medio). */
  indeterminate: Boolean,
  /** Permite selección múltiple (usa `value` por opción). */
  multiple: Boolean,
  /** Deshabilita el checkbox. */
  disabled: Boolean,
  /** Solo lectura (no cambia el valor). */
  readonly: Boolean,
  /** Estado de error visual. */
  error: Boolean,
  /** Etiqueta al lado del checkbox. */
  label: String,
  /** Texto de ayuda bajo el campo. */
  hint: String,
  /** Muestra el hint siempre (no solo al enfocar). */
  persistentHint: Boolean,
  /** Mensajes de error externos. */
  errorMessages: [String, Array],
  /** Reglas de validación: `(valor) => true | string`. */
  rules: Array,
  /** Cuándo validar: 'input' valida al escribir. */
  validateOn: String,
  /** Efecto ripple al hacer click. */
  ripple: { type: [Boolean, Object], default: true },
  /** Densidad del padding. */
  density: { type: String, default: 'default' },
  /** Dirección del layout (label al lado o debajo). */
  direction: { type: String, default: 'horizontal' },
  /** Color cuando está activo. */
  color: String,
  /** Color del ícono. */
  iconColor: [String, Boolean],
  /** Color base cuando está inactivo. */
  baseColor: String,
  /** Ícono personalizado para el estado activo. */
  trueIcon: { type: null, default: undefined },
  /** Ícono personalizado para el estado inactivo. */
  falseIcon: { type: null, default: undefined },
  /** Ícono personalizado para el estado indeterminado. */
  indeterminateIcon: { type: null, default: undefined },
  /** Ícono externo al inicio. */
  prependIcon: { type: null, default: undefined },
  /** Ícono externo al final. */
  appendIcon: { type: null, default: undefined },
  /** Nombre del input nativo (agrupa radios/checkboxes). */
  name: String,
  /** Id del input nativo. */
  id: String,
  /** Resplandor decorativo. */
  glow: Boolean,
  /** Oculta el área de detalles (errores/hint). Acepta 'auto'. */
  hideDetails: [Boolean, String],
  /** Centra el afijo verticalmente. */
  centerAffix: { type: Boolean, default: true },
  /** Comparador custom para igualdad de valores: `(a, b) => boolean`. */
  valueComparator: Function,
  /** Valor usado para validar (por defecto el modelValue). */
  validationValue: null,
  /** Estado de foco controlado. */
  focused: Boolean,
  /** Cantidad máxima de errores visibles. */
  maxErrors: { type: [String, Number], default: 1 },
  /** Ancho del campo. */
  width: [String, Number],
  /** Ancho mínimo del campo. */
  minWidth: [String, Number],
  /** Ancho máximo del campo. */
  maxWidth: [String, Number],
  /** Tamaño: 'sm' | 'md' | 'lg'. */
  size: { type: String, default: 'md' }
}
