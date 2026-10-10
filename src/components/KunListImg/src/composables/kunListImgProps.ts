export const kunListImgProps = {
  /** URL de la imagen (requerido). */
  src: {
    type: String,
    required: true
  },
  /** Texto alternativo. */
  alt: {
    type: String,
    default: ''
  },
  /** Color de fondo mientras carga. */
  bgColor: {
    type: String,
    default: 'bg-surface'
  }
}
