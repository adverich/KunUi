export const kunListItemAvatarProps = {
  /** Texto (iniciales) del avatar. */
  text: {
    type: [String, Number],
    default: null
  },
  /** Tamaño predefinido. */
  size: {
    type: String,
    default: 'md'
  },
  /** Redondeo. */
  rounded: {
    type: String,
    default: 'rounded-full'
  },
  /** Color de fondo. */
  bgColor: {
    type: String,
    default: 'bg-surface-light'
  },
  /** Color del texto. */
  textColor: {
    type: String,
    default: 'text-ui-inverse'
  },
  /** Peso del texto. */
  fontWeight: {
    type: String,
    default: 'font-medium'
  }
}
