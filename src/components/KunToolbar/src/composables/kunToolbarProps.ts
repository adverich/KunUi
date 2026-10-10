export const kunToolbarProps = {
  /** Posicionamiento absoluto. */
  absolute: Boolean,
  /** Color de fondo. */
  bgColor: String,
  /** Posición del título. */
  titlePosition: { type: String, default: 'left' },
  /** Muestra borde inferior. */
  bordered: { type: Boolean, default: false },
  /** Color del borde. */
  borderColor: String,
  /** Colapsa el toolbar (solo extensión). */
  collapse: Boolean,
  /** Densidad del padding. */
  density: { type: String, default: 'default' },
  /** Nivel de sombra. */
  elevation: [String, Number],
  /** Muestra la fila de extensión. */
  extended: Boolean,
  /** Altura de la extensión en px. */
  extensionHeight: {
    type: [String, Number],
    default: 48,
  },
  /** Sin sombra. */
  flat: Boolean,
  /** Flotante sobre el contenido. */
  floating: Boolean,
  /** Altura del toolbar. */
  height: [String, Number],
  /** URL de imagen de fondo. */
  image: String,
  /** Redondeo (true = default). */
  rounded: [String, Boolean],
  /** Tag del contenedor. */
  tag: { type: String, default: 'header' },
  /** Tema de color. */
  theme: String,
  /** Sin redondeo. */
  tile: Boolean,
  /** Título (alternativa al slot). */
  title: String,
  /** Ancho máximo del título. */
  titleMaxWidth: { type: String, default: 'max-w-3/4' },
  /** Clase de la sección izquierda. */
  leftSectionClass: { type: String, default: 'flex items-center gap-x-2' },
  /** Clase de la sección derecha. */
  rightSectionClass: { type: String, default: 'flex items-center gap-x-2 justify-end' },
}
