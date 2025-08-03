export const kunTextareaProps = {
  modelValue: [String, Number, Object],

  label: String,
  hint: String,
  class: String,
  bgColor: String,
  textColor: String,
  textAlign: {
    type: String,
    default: 'left',
  },

  loading: Boolean,

  prependIcon: [String, Object, Function],
  appendIcon: [String, Object, Function],

  prependInnerIcon: [String, Object, Function],
  appendInnerIcon: [String, Object, Function],

  clearable: Boolean,
  persistentClear: Boolean,

  loader: Boolean,
  hideDetails: [Boolean, String],

  disabled: Boolean,
  readonly: Boolean,

  blurValidation: Boolean,

  rules: Array,
  errorMessages: [String, Array],
  maxErrors: {
    type: Number,
    default: 3,
  },

  error: Boolean,

  counter: Boolean,
  persistentCounter: Boolean,
  maxLength: [Number, String],

  autoGrow: Boolean,
  noResize: Boolean,
  maxRows: [Number, String],

  placeholder: String,
  name: String,
  id: String,
  autocomplete: String,
  rows: {
    type: [Number, String],
    default: 5,
  },

  dirty: Boolean,
  variant: {
    type: String,
    default: 'outlined',
  },
  density: {
    type: String,
    default: 'default',
  },
  inputClass: [String, Array],
  wrapperClass: [String, Array],
  tile: Boolean,
  rounded: [String, Number],
  flat: Boolean,
  color: String,
  loadingColor: String,
}
