export const kunDragAndDropHandleProps = {
  /** Deshabilita el handle. */
  disabled: {
    type: Boolean,
    default: false,
  },
  /** Etiqueta accesible del handle. */
  label: {
    type: String,
    default: 'Arrastrar',
  },
  /** Tamaño del handle. */
  size: {
    type: String,
    default: 'xs',
    validator: (v: unknown) => ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'].includes(v as string),
  },
  /** Clase extra del handle. */
  wrapperClass: {
    type: String,
    default: '',
  },
}
