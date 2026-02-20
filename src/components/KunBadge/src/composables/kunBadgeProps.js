export const kunBadgeProps = {
  text: { type: [String, Number], default: '' },
  bgColor: { type: String, default: 'bg-red-500' },
  textColor: { type: String, default: 'text-white' },
  textSize: { type: String, default: 'text-xs' },
  fontWeight: { type: String, default: 'font-bold' },
  rounded: { type: String, default: 'rounded-full' },
  dot: { type: Boolean, default: false },
  visible: { type: Boolean, default: true },
  position: {
    type: String,
    default: 'top right',
    validator: (val) =>
      [
        'top left', 'top center', 'top right',
        'center left', 'center center', 'center right',
        'bottom left', 'bottom center', 'bottom right'
      ].includes(val)
  },
  ejeX: { type: [Number, String], default: 25 },
  ejeY: { type: [Number, String], default: -15 },
  cursor: { type: String, default: 'cursor-default' }
}
