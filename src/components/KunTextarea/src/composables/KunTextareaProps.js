export const kunTextareaProps = {
  modelValue: [String, Number],
  label: String,
  placeholder: String,
  rows: {
    type: [String, Number],
    default: 1,
  },
  autoGrow: Boolean,
  noResize: Boolean,
  maxRows: [Number, String], // 🔧 Agregado

  clearable: Boolean,
  clearIcon: {
    type: [String, Function, Object],
    default: 'i-mdi-close',
  },
  disabled: Boolean,
  readonly: Boolean,

  variant: {
    type: String,
    default: 'filled',
  },
  density: {
    type: String,
    default: 'default',
  },

  // Estilo
  rounded: [Boolean, String, Number],
  tile: Boolean,
  flat: Boolean,
  color: String,
  bgColor: String,
  baseColor: String,
  iconColor: [String, Boolean],
  glow: Boolean,
  class: [String, Array, Object],
  inputClass: [String, Array, Object],
  wrapperClass: [String, Array, Object],

  // Iconos
  prependIcon: [String, Object, Function, Array],
  appendIcon: [String, Object, Function, Array],
  prependInnerIcon: [String, Object, Function, Array],
  appendInnerIcon: [String, Object, Function, Array],

  // Validación
  rules: {
    type: Array,
    default: () => [],
  },
  error: Boolean,
  errorMessages: {
    type: [String, Array],
    default: () => [],
  },
  maxErrors: {
    type: [String, Number],
    default: 1,
  },
  validationValue: null,
  validateOn: String,
  hint: String,
  persistentHint: Boolean,
  hideDetails: {
    type: [Boolean, String],
    default: false,
  },
  persistentCounter: Boolean,

  // Loader
  loading: Boolean,
  loadingColor: {
    type: String,
    default: 'bg-slate-500',
  },
}
