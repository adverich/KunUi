export default {
  modelValue: {
    type: [String, Number], default: ''
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: null,
    default: 'text',
  },
  locale: {
    type: String,
    default: 'ar-ES',
  },
  prefix: {
    type: String,
    default: '',
  },
  suffix: {
    type: String,
    default: '',
  },
  rounded: {
    type: String,
    default: 'rounded'
  },
  error: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String, default: ''
  },
  rules: {
    type: Array, default: () => []
  },
};