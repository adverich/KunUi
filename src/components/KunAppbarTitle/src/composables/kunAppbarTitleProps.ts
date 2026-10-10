export const kunAppbarTitleProps = {
  /** Texto del título. */
  title: String,
  /** URL del logo a mostrar junto al título. */
  titleImage: String,
  /** Altura del logo. */
  titleImageSize: {
    type: String,
    default: 'h-6'
  },
  /** Tamaño del texto. */
  textSize: {
    type: String,
    default: 'text-base'
  },
  /** Peso del texto. */
  fontWeight: {
    type: String,
    default: 'font-medium'
  }
}
