export const kunCarouselSlideProps = {
  /** Clase extra del slide. */
  slideClass: {
    type: [String, Array, Object],
    default: '',
  },
  /** Tamaño individual (sobrescribe el slideSize del carousel). */
  size: {
    type: String,
    default: null,
  },
}

export default kunCarouselSlideProps
