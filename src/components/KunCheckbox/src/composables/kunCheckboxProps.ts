import type { PropType } from 'vue';
import { isKunColor, type KunColor } from '../../../../theme/kunVariants.js';

export type KunCheckboxDirection = 'horizontal' | 'vertical';
export type KunCheckboxSize = 'sm' | 'md' | 'lg';
export type KunCheckboxValidateOn = 'blur' | 'input';
export type KunCheckboxDensity = 'default' | 'comfortable' | 'compact';

export const kunCheckboxProps = {
  /** Valor del checkbox (v-model). En modo `multiple` es el array de seleccionados. Acepta `null` (sin valor). */
  modelValue: { type: [Boolean, Array, String, Number, Object] as PropType<boolean | unknown[] | string | number | Record<string, unknown> | null> },
  /** Valor que representa el estado activo (cualquier tipo; el default no estrecha la inferencia). */
  trueValue: { type: [Boolean, Array, String, Number, Object] as PropType<unknown>, default: true as unknown },
  /** Valor que representa el estado inactivo (cualquier tipo; el default no estrecha la inferencia). */
  falseValue: { type: [Boolean, Array, String, Number, Object] as PropType<unknown>, default: false as unknown },
  /** Valor de esta opción (para grupos con `multiple`). Acepta cualquier tipo. */
  value: { type: [Boolean, Array, String, Number, Object] as PropType<unknown>, default: undefined as unknown },
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
  validateOn: {
    type: String as PropType<KunCheckboxValidateOn>,
    validator: (v: unknown) => ['blur', 'input'].includes(v as string)
  },
  /** Efecto ripple al hacer click. */
  ripple: { type: [Boolean, Object], default: true },
  /** Densidad del padding (escala el tamaño como KunAvatar: comfortable/compact reducen). */
  density: {
    type: String as PropType<KunCheckboxDensity>,
    default: 'default',
    validator: (v: unknown) => ['default', 'comfortable', 'compact'].includes(v as string)
  },
  /** Dirección del layout (label al lado o debajo). */
  direction: {
    type: String as PropType<KunCheckboxDirection>,
    default: 'horizontal',
    validator: (v: unknown) => ['horizontal', 'vertical'].includes(v as string)
  },
  /** Color semántico de la caja activa; `null` usa el default (`bg-primary text-highlighted`). */
  color: { type: String as PropType<KunColor | null>, default: null, validator: (v: unknown) => v === null || isKunColor(v) },
  /** Color semántico del glifo (✓) sobre la caja; gana sobre el texto heredado de `color`. */
  iconColor: { type: String as PropType<KunColor | null>, default: null, validator: (v: unknown) => v === null || isKunColor(v) },
  /** Color semántico de la caja inactiva (tinte suave); `null` usa `bg-elevated`. */
  baseColor: { type: String as PropType<KunColor | null>, default: null, validator: (v: unknown) => v === null || isKunColor(v) },
  /** Ícono personalizado para el estado activo. Acepta alias `$`, componente o clase CSS. */
  trueIcon: { type: [String, Object, Function] as PropType<string | Record<string, unknown> | Function | null>, default: undefined },
  /** Ícono personalizado para el estado inactivo. Acepta alias `$`, componente o clase CSS. */
  falseIcon: { type: [String, Object, Function] as PropType<string | Record<string, unknown> | Function | null>, default: undefined },
  /** Ícono personalizado para el estado indeterminado. Acepta alias `$`, componente o clase CSS. */
  indeterminateIcon: { type: [String, Object, Function] as PropType<string | Record<string, unknown> | Function | null>, default: undefined },
  /** Ícono externo al inicio. Acepta alias `$`, componente o clase CSS. */
  prependIcon: { type: [String, Object, Function] as PropType<string | Record<string, unknown> | Function | null>, default: undefined },
  /** Ícono externo al final. Acepta alias `$`, componente o clase CSS. */
  appendIcon: { type: [String, Object, Function] as PropType<string | Record<string, unknown> | Function | null>, default: undefined },
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
  /** Valor usado para validar (por defecto el modelValue). Acepta cualquier tipo. */
  validationValue: { type: [Boolean, Array, String, Number, Object] as PropType<unknown>, default: undefined as unknown },
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
  size: {
    type: String as PropType<KunCheckboxSize>,
    default: 'md',
    validator: (v: unknown) => ['sm', 'md', 'lg'].includes(v as string)
  }
}
