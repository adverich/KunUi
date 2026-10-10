import type { PropType } from 'vue';

export type KunNumberFieldDensity = 'default' | 'comfortable' | 'compact';

export const KunNumberFieldProps = {
  // Core
  // null es parte del ciclo de vida (onClear emite null)
  modelValue: { type: [Number, String] as PropType<number | string | null>, default: null },
  type: { type: String, default: 'text' },
  placeholder: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  labelColor: { type: String, default: 'text-ui' },
  floatingLabelColor: { type: String, default: null },
  labelSize: { type: String, default: 'text-sm' },
  floatingLabelSize: { type: String, default: 'text-xs' },
  labelOpacity: { type: String, default: 'opacity-60' },
  floatingLabelOpacity: { type: String, default: 'opacity-80' },
  labelLeft: { type: String, default: null },
  floatingLabelLeft: { type: String, default: 'left-2' },
  floatingLabelTop: { type: String, default: '-top-2' },
  labelClass: { type: String, default: '' },
  dirty: { type: Boolean, default: false },

  // Decoradores
  prefix: { type: String, default: '' },
  suffix: { type: String, default: '' },
  prependIcon: String,
  appendIcon: String,
  prependInnerIcon: { type: [String, Object, Function, Array], default: null },
  appendInnerIcon: { type: [String, Object, Function, Array], default: null },
  prependInnerClass: String,
  appendInnerClass: String,

  // Estilo y diseño
  rounded: { type: String, default: 'rounded' },
  borderColor: { type: String, default: 'border-ui' },
  textColor: { type: String, default: 'text-ui' },
  inputTextSize: { type: String, default: null },
  inputWeight: { type: String, default: null },
  placeholderColor: { type: String, default: 'placeholder-ui' },
  placeholderTextSize: { type: String, default: null },
  inputStyle: { type: String, default: '' },
  bgInput: { type: String, default: 'bg-field-background' },
  textCenter: { type: Boolean, default: false },
  controlVariant: { type: String, default: 'default' },
  noArrows: { type: Boolean, default: false },
  density: {
    type: String as PropType<KunNumberFieldDensity>,
    default: 'default',
    validator: (v: unknown) => ['default', 'comfortable', 'compact'].includes(v as string),
  },

  // Estado
  error: { type: Boolean, default: false },
  errorMessages: [String, Array],
  rules: { type: Array, default: () => [] },
  // Atributos HTML nativos
  id: { type: String, default: null },
  name: { type: String, default: null },
  autocomplete: { type: String, default: 'off' },
  inputmode: { type: String, default: 'decimal' },
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
  locale: { type: String as PropType<string | null>, default: null },
  separator: { type: String, default: ',' },
  useGrouping: { type: Boolean, default: true },
  precision: { type: [Number, String], default: 2 },

  formatMode: {
    type: String,
    default: 'natural', // 'bank' | 'natural'
  },
};
