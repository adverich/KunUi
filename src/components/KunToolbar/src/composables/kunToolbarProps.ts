import type { PropType } from 'vue';

export type KunToolbarTitlePosition = 'left' | 'center' | 'right';
export type KunToolbarDensity = 'default' | 'prominent' | 'comfortable' | 'compact';

export const kunToolbarProps = {
  /** Posicionamiento absoluto. */
  absolute: Boolean,
  /** Posición del título. */
  titlePosition: {
    type: String as PropType<KunToolbarTitlePosition>,
    default: 'left',
    validator: (v: unknown) => ['left', 'center', 'right'].includes(v as string),
  },
  /** Muestra borde inferior (`border-b border-default`). Por defecto `true`. */
  bordered: { type: Boolean, default: true },
  /** Colapsa el toolbar (solo extensión). */
  collapse: Boolean,
  /** Densidad del padding. */
  density: {
    type: String as PropType<KunToolbarDensity>,
    default: 'default',
    validator: (v: unknown) => ['default', 'prominent', 'comfortable', 'compact'].includes(v as string),
  },
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
  /** Redondeo (`rounded-lg`). `tile` lo anula. */
  rounded: Boolean,
  /** Tag del contenedor. */
  tag: { type: String, default: 'header' },
  /** Tema de color (hook de clase `theme-<valor>` para CSS del consumidor). */
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
