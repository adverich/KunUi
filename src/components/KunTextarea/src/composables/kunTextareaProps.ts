export const kunTextareaProps = {
  /** Valor del campo (v-model). Con formatModel='json' acepta objetos. */
  modelValue: [String, Number, Object],

  /** Etiqueta flotante. */
  label: String,
  /** Texto de ayuda. */
  hint: String,
  /** Muestra el hint siempre. */
  persistentHint: { type: Boolean, default: false },
  /** Clase extra del textarea. */
  class: String,
  /** Color de fondo (se usa si la variante no lo define). */
  bgColor: String,
  /** Color del texto. */
  textColor: String,
  /** Alineación del texto. */
  textAlign: { type: String, default: 'left' },
  /** Formato del modelo: 'auto' (detecta JSON) | 'json' | 'plain'. */
  formatModel: { type: String, default: 'auto' }, // 'auto' | 'json' | 'plain'

  /** Muestra barra de carga superior. */
  loading: Boolean,

  /** Ícono externo al inicio. */
  prependIcon: [String, Object, Function],
  /** Ícono externo al final. */
  appendIcon: [String, Object, Function],

  /** Ícono interno al inicio. */
  prependInnerIcon: [String, Object, Function],
  /** Ícono interno al final. */
  appendInnerIcon: [String, Object, Function],

  /** Muestra botón limpiar. */
  clearable: Boolean,
  /** El botón limpiar siempre visible (no solo con valor). */
  persistentClear: Boolean,

  /** Muestra loader (reservado, actualmente sin efecto; usar `loading`). */
  loader: Boolean,
  /** Oculta el área de detalles ('auto' = solo si hay mensajes/hint). */
  hideDetails: [Boolean, String],

  /** Deshabilita el campo. */
  disabled: Boolean,
  /** Solo lectura. */
  readonly: Boolean,

  /** Valida al perder el foco. */
  blurValidation: Boolean,

  /** Reglas de validación: `(valor) => true | string`. */
  rules: Array,
  /** Mensajes de error externos. */
  errorMessages: [String, Array],
  /** Cantidad máxima de errores visibles. */
  maxErrors: {
    type: Number,
    default: 3,
  },

  /** Estado de error visual. */
  error: Boolean,

  /** Muestra contador de caracteres. */
  counter: Boolean,
  /** Contador siempre visible (no solo en foco). */
  persistentCounter: Boolean,
  /** Límite para el contador (no limita el input). */
  maxLength: [Number, String],

  /** Ajusta la altura al contenido automáticamente. */
  autoGrow: Boolean,
  /** Deshabilita el resize manual. */
  noResize: Boolean,
  /** Filas máximas con `autoGrow`. */
  maxRows: [Number, String],

  /** Placeholder. */
  placeholder: String,
  /** Nombre del textarea nativo. */
  name: String,
  /** Id del textarea nativo. */
  id: String,
  /** Autocomplete nativo. */
  autocomplete: String,
  /** Filas visibles iniciales. */
  rows: {
    type: [Number, String],
    default: 5,
  },

  /** Marca el campo como tocado (flota el label). */
  dirty: Boolean,
  /** Variante visual: 'filled' | 'outlined' | 'underlined' | 'solo'. */
  variant: {
    type: String,
    default: 'outlined',
  },
  /** Densidad del padding. */
  density: {
    type: String,
    default: 'default',
  },
  /** Clase extra del textarea. */
  inputClass: [String, Array],
  /** Clase extra del contenedor. */
  wrapperClass: [String, Array],
  /** Sin redondeo. */
  tile: Boolean,
  /** Redondeo (string/number = clase `rounded-<valor>`). */
  rounded: [String, Number],
  /** Sin sombra. */
  flat: Boolean,
  /** Color de acento (foco). */
  color: String,
  /** Color del anillo de foco. */
  focusRingColor: { type: String, default: 'ring-ui-focus' },
  /** Color de la barra de carga. */
  loadingColor: String,
  /** Muestra el botón limpiar (requiere `clearable` con valor). */
  clearIcon: Boolean,
  /** Debounce en ms para emitir el modelo. */
  debounceTime: {
    type: Number,
    default: 300,
  },
}
