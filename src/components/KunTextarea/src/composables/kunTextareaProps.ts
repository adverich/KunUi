import type { PropType } from 'vue';

export type KunTextareaTextAlign = 'left' | 'center' | 'right';
export type KunTextareaFormatModel = 'auto' | 'json' | 'plain';
export type KunTextareaVariant = 'filled' | 'outlined' | 'underlined' | 'solo';
export type KunTextareaDensity = 'default' | 'comfortable' | 'compact';

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
  /** Alineación del texto. */
  textAlign: {
    type: String as PropType<KunTextareaTextAlign>,
    default: 'left',
    validator: (v: unknown) => ['left', 'center', 'right'].includes(v as string),
  },
  /** Formato del modelo: 'auto' (detecta JSON) | 'json' | 'plain'. */
  formatModel: {
    type: String as PropType<KunTextareaFormatModel>,
    default: 'auto',
    validator: (v: unknown) => ['auto', 'json', 'plain'].includes(v as string),
  }, // 'auto' | 'json' | 'plain'

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
  /** Máximo de caracteres (`maxlength` nativo; también limita el contador). */
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
    type: String as PropType<KunTextareaVariant>,
    default: 'outlined',
    validator: (v: unknown) => ['filled', 'outlined', 'underlined', 'solo'].includes(v as string),
  },
  /** Densidad del padding. */
  density: {
    type: String as PropType<KunTextareaDensity>,
    default: 'default',
    validator: (v: unknown) => ['default', 'comfortable', 'compact'].includes(v as string),
  },
  /** Clase extra del textarea. */
  inputClass: [String, Array],
  /** Clase extra del contenedor. */
  wrapperClass: [String, Array],
  /** Sin redondeo. */
  tile: Boolean,
  /** Redondeo (clase de escala, `rounded-md` por defecto). */
  rounded: { type: String, default: 'rounded-md' },
  /** Sin sombra. */
  flat: Boolean,
  /** Color de la barra de carga (clase `bg-*` del theme). */
  loadingColor: String,
  /** Muestra el botón limpiar (requiere `clearable` con valor). */
  clearIcon: Boolean,
  /** Debounce en ms para emitir el modelo. */
  debounceTime: {
    type: Number,
    default: 300,
  },
}
