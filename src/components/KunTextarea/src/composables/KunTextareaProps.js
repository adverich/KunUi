export const kunTextareaProps = {
  modelValue: [String, Number, Array, Object, Boolean],
  formatModel: {
    type: String,
    default: 'auto', // auto | raw | json
  },
  label: String,
  dirty: { type: Boolean, default: false },
  placeholder: String,
  rows: { type: [String, Number], default: 1 },
  autoGrow: Boolean,
  noResize: Boolean,
  maxRows: [Number, String],

  clearable: Boolean,
  clearIcon: {
    type: [String, Function, Object],
    default: 'i-mdi-close',
  },
  persistentClear: Boolean,
  disabled: Boolean,
  readonly: Boolean,

  variant: { type: String, default: 'filled' },
  density: { type: String, default: 'default' },

  // Estilo
  rounded: [Boolean, String, Number],
  tile: Boolean,
  flat: Boolean,
  color: String,
  bgColor: String,
  textColor: String,
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
  hideDetails: { type: [Boolean, String], default: false },
  persistentCounter: Boolean,

  // Loader
  loading: Boolean,
  loadingColor: { type: String, default: 'bg-slate-500' },
}
