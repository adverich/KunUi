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
  borderColor: { type: String, default: 'border-gray-300 dark:border-gray-700' },
  textColor: { type: String, default: 'text-black dark:text-white' },
  labelColor: { type: String, default: 'text-black/80 dark:text-white/80' },
  placeholderColor: { type: String, default: 'placeholder-black/60 dark:placeholder-white/60' },
  bgInput: { type: String, default: 'bg-slate-200 dark:bg-slate-800' },
  textCenter: { type: Boolean, default: false },
  density: { type: String, default: 'default' },

  // Estado
  error: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' },
  rules: { type: Array, default: () => [] },
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

  showPasswordToggle: { type: Boolean, default: true }
}
