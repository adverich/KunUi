export const kunIconProps = {
  icon: {
    type: [String, Object, Function],
    required: false
  },
  aliases: {
    type: Object,
    default: () => ({})
  },
  size: {
    type: String,
    default: 'text-md'
  },
  color: {
    type: String,
    default: 'text-font-color'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  contentClass: [String, Array, Object],
}
