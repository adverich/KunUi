export default {
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  dirty: { type: Boolean, default: false },

  // Decoradores
  prefix: { type: String, default: '' },
  suffix: { type: String, default: '' },
  prependIcon: String,
  appendIcon: String,
  prependInnerClass: String,
  appendInnerClass: String,

  // Estilo y diseño
  rounded: { type: String, default: 'rounded' },
  borderColor: { type: String, default: 'border-ui' },
  textColor: { type: String, default: 'text-ui' },
  labelColor: { type: String, default: 'text-ui' },
  placeholderColor: { type: String, default: 'placeholder-ui' },
  bgInput: { type: String, default: 'bg-field-background' },
  inputStyle: { type: String, default: '' },
  textCenter: { type: Boolean, default: false },
  density: { type: String, default: 'default' },

  // Estado
  error: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' },
  rules: { type: Array, default: () => [] },
  // Atributos HTML nativos
  id: { type: String, default: null },
  name: { type: String, default: null },
  autocomplete: { type: String, default: 'off' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  inputmode: { type: String, default: null },
  minlength: { type: [Number, String], default: null },
  clearable: { type: Boolean, default: false },
  maxlength: { type: [Number, String], default: null },
  pattern: { type: String, default: null },
  spellcheck: { type: [Boolean, String], default: null },
  counter: { type: Boolean, default: false },
  debounce: { type: Number, default: 300 },

  // Ayuda y detalles
  hint: { type: String, default: '' },
  persistentHint: { type: Boolean, default: false },
  hideDetails: { type: Boolean, default: false },
  validateOnBlur: { type: Boolean, default: false },

  showPasswordToggle: { type: Boolean, default: true }
}
