export const kunThumbProps = {
  value: Number,
  thumbStyle: Object,
  thumbLabel: Boolean,
  thumbColor: {
    type: String,
    default: 'bg-blue-500'
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  step: {
    type: Number,
    default: 1
  }
}
