export const kunDragAndDropItemProps = {
  /** Valor del ítem. */
  item: {
    type: [Object, String, Number],
    default: null,
  },
  /** Clave estable del ítem (debe coincidir con el `itemKey` del padre). */
  itemKey: {
    type: [String, Number],
    default: null,
  },
  /** Índice del ítem en la lista. */
  index: {
    type: Number,
    default: 0,
  },
  /** Excluye el ítem del drag. */
  disabled: {
    type: Boolean,
    default: false,
  },
  /** Tag del contenedor del ítem. */
  tag: {
    type: String,
    default: 'div',
  },
  /** Clase extra del ítem. */
  wrapperClass: {
    type: String,
    default: '',
  },
}
