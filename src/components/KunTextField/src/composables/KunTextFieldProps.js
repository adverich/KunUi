export default {
  type: {
    type: String,
    default: 'text',
  },
  locale: {
    type: String,
    default: 'ar-ES',
  },
  precision: {
    type: Number,
    default: 2,
  },
  prefix: {
    type: String,
    default: '',
  },
  suffix: {
    type: String,
    default: '',
  },
  resize: {
    type: Boolean,
    default: false,
  },
  rounded:{
    type: String,
    default: 'rounded'
  }
};