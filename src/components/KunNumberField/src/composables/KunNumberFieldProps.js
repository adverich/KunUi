export const KunNumberFieldProps = {
  // Core
  modelValue: { type: [Number, String], default: null },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  label: { type: String, default: '' },
  dirty: { type: Boolean, default: false },

  // Decoradores
  prefix: { type: String, default: '' },
  suffix: { type: String, default: '' },
  prependIcon: String,
  appendIcon: String,

  // Estilo y diseño
  rounded: { type: String, default: 'rounded' },
  borderColor: { type: String, default: 'border-ui' },
  textColor: { type: String, default: 'text-ui' },
  labelColor: { type: String, default: 'text-ui' },
  placeholderColor: { type: String, default: 'placeholder-ui' },
  bgInput: { type: String, default: 'bg-field-background' },
  textCenter: { type: Boolean, default: false },
  controlVariant: { type: String, default: 'default' },
  noArrows: { type: Boolean, default: false },
  density: { type: String, default: 'default' },

  // Estado
  error: { type: Boolean, default: false },
  errorMessages: [String, Array],
  rules: { type: Array, default: () => [] },
  // Atributos HTML nativos
  id: { type: String, default: null },
  name: { type: String, default: null },
  autocomplete: { type: String, default: 'off' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  maxlength: { type: [Number, String], default: null },
  counter: { type: Boolean, default: false },
  debounce: { type: Number, default: 300 },

  // Ayuda y detalles
  hint: { type: String, default: '' },
  persistentHint: { type: Boolean, default: false },
  hideDetails: { type: Boolean, default: false },
  validateOnBlur: { type: Boolean, default: false },

  // Reglas numéricas
  min: { type: [Number, String], default: -Infinity },
  max: { type: [Number, String], default: Infinity },
  step: { type: [Number, String], default: 1 },
  locale: { type: String, default: null },
  separator: { type: String, default: ',' },
  useGrouping: { type: Boolean, default: true },
  precision: { type: [Number, String], default: 2 },

  formatMode: {
    type: String,
    default: 'natural', // 'bank' | 'natural'
  },
};
