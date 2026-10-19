import type { PropType } from 'vue';

export type KunTextFieldDensity = 'default' | 'comfortable' | 'compact';

export default {
  /** Valor del campo (v-model). */
  modelValue: { type: [String, Number], default: '' },
  /** Tipo del input nativo ('text' | 'password' | ...). Con 'password' muestra toggle. */
  type: { type: String, default: 'text' },
  /** Placeholder. Si existe, el label flota siempre. */
  placeholder: { type: [String, Number], default: '' },
  /** Etiqueta flotante (centrada en reposo, arriba en foco/valor). */
  label: { type: String, default: '' },
  /** Marca el campo como tocado (flota el label). */
  dirty: { type: Boolean, default: false },

  // Decoradores
  /** Texto fijo al inicio. */
  prefix: { type: String, default: '' },
  /** Texto fijo al final. */
  suffix: { type: String, default: '' },
  /** Ícono externo al inicio (fuera del borde). */
  prependIcon: String,
  /** Ícono externo al final (fuera del borde). */
  appendIcon: String,
  /** Ícono interno al inicio. */
  prependInnerIcon: { type: [String, Object, Function, Array] as PropType<string | Record<string, any> | Function | unknown[] | null>, default: null },
  /** Ícono interno al final. */
  appendInnerIcon: { type: [String, Object, Function, Array] as PropType<string | Record<string, any> | Function | unknown[] | null>, default: null },
  /** Clase del contenedor del ícono interno inicial. */
  prependInnerClass: String,
  /** Clase del contenedor del ícono interno final. */
  appendInnerClass: String,

  // Estilo y diseño
  /** Redondeo del contenedor (clase de escala, `rounded-md` por defecto). */
  rounded: { type: String, default: 'rounded-md' },
  /** Tamaño del label en reposo. */
  labelSize: { type: String, default: 'text-sm' },
  /** Tamaño del label flotando. */
  floatingLabelSize: { type: String, default: 'text-xs' },
  /** Opacidad del label en reposo. */
  labelOpacity: { type: String, default: 'opacity-60' },
  /** Opacidad del label flotando. */
  floatingLabelOpacity: { type: String, default: 'opacity-80' },
  /** Offset izquierdo del label en reposo (null = automático según iconos). */
  labelLeft: { type: String as PropType<string | null>, default: null },
  /** Offset izquierdo del label flotando. */
  floatingLabelLeft: { type: String, default: 'left-2' },
  /** Posición superior del label flotando ('top-[-2px]' + `-translate-y-1/2` = centrado sobre el borde). */
  floatingLabelTop: { type: String, default: 'top-[-2px]' },
  /** Clase libre para el label. */
  labelClass: { type: String, default: '' },
  /** Tamaño del texto del valor (null = 'text-sm'). */
  inputTextSize: { type: String as PropType<string | null>, default: null },
  /** Peso del texto del valor (null = hereda). */
  inputWeight: { type: String as PropType<string | null>, default: null },
  /** Tamaño del placeholder ('text-lg' o 'placeholder:text-lg'). */
  placeholderTextSize: { type: String as PropType<string | null>, default: null },
  /** Clase libre para el input. */
  inputStyle: { type: String, default: '' },
  /** Centra el texto del valor. */
  textCenter: { type: Boolean, default: false },
  /** Densidad del padding y alturas. */
  density: {
    type: String as PropType<KunTextFieldDensity>,
    default: 'default',
    validator: (v: unknown) => ['default', 'comfortable', 'compact'].includes(v as string),
  },

  // Estado
  /** Estado de error visual. */
  error: { type: Boolean, default: false },
  /** Mensaje de error externo. */
  errorMessage: { type: String, default: '' },
  /** Reglas de validación: `(valor) => true | string`. */
  rules: { type: Array, default: () => [] },
  // Atributos HTML nativos
  /** Id del input nativo. */
  id: { type: String as PropType<string | null>, default: null },
  /** Nombre del input nativo. */
  name: { type: String as PropType<string | null>, default: null },
  /** Autocomplete nativo. */
  autocomplete: { type: String, default: 'off' },
  /** Requerido (nativo + validación). */
  required: { type: Boolean, default: false },
  /** Deshabilita el campo. */
  disabled: { type: Boolean, default: false },
  /** Solo lectura. */
  readonly: { type: Boolean, default: false },
  /** Teclado virtual en móvil. */
  inputmode: { type: String as PropType<string | null>, default: null },
  /** Longitud mínima nativa. */
  minlength: { type: [Number, String] as PropType<number | string | null>, default: null },
  /** Muestra botón limpiar. */
  clearable: { type: Boolean, default: false },
  /** Longitud máxima nativa (activa el counter). */
  maxlength: { type: [Number, String] as PropType<number | string | null>, default: null },
  /** Patrón regex nativo. */
  pattern: { type: String as PropType<string | null>, default: null },
  /** Corrector ortográfico nativo. */
  spellcheck: { type: [Boolean, String] as PropType<boolean | string | null>, default: null },
  /** Muestra contador (requiere `maxlength`). */
  counter: { type: Boolean, default: false },
  /** Debounce en ms para emitir el modelo. */
  debounce: { type: Number, default: 300 },

  // Ayuda y detalles
  /** Texto de ayuda. */
  hint: { type: String, default: '' },
  /** Muestra el hint siempre. */
  persistentHint: { type: Boolean, default: false },
  /** Oculta el área de detalles. */
  hideDetails: { type: Boolean, default: false },
  /** Valida solo al perder el foco. */
  validateOnBlur: { type: Boolean, default: false },

  /** Muestra toggle ver/ocultar con `type="password"`. */
  showPasswordToggle: { type: Boolean, default: true }
}
