export const kunDrawerProps = {
  /** Apertura del drawer (v-model). */
  modelValue: Boolean,
  /** Posicionamiento absoluto dentro del contenedor. */
  absolute: Boolean,
  /** Borde (boolean o clase de color). */
  border: [Boolean, String, Number],
  /** Color de fondo. */
  color: String,
  /** Nivel de sombra. */
  elevation: [String, Number],
  /** Sin bordes ni fondo (flotante). */
  floating: Boolean,
  /** URL de imagen de fondo. */
  image: String,
  /** Lado de apertura: 'start' | 'end' | 'top' | 'bottom'. */
  location: { type: String, default: 'start' },
  /** Siempre visible (ignora el modelo). */
  permanent: Boolean,
  /** No cierra al hacer click fuera. */
  persistent: Boolean,
  /** Modo rail (colapsado a iconos). */
  rail: Boolean,
  /** Ancho en modo rail. */
  railWidth: { type: String, default: 'w-[56px]' },
  /** Redondeo de bordes. */
  rounded: [Boolean, String, Number],
  /** Muestra scrim (overlay) al abrir. */
  scrim: { type: [Boolean, String], default: true },
  /** Tag del contenedor. */
  tag: { type: [String, Object], default: 'nav' },
  /** Se cierra automáticamente al navegar o hacer click fuera. */
  temporary: Boolean,
  /** Ancho del drawer. */
  width: { type: String, default: 'w-[256px]' },
  /** Ocupa todo el alto (ignora el appbar). */
  fullHeight: Boolean,
  /** Contenido con scroll interno. */
  scrollable: { type: Boolean, default: true },
  /** Habilita apertura/cierre por gesto táctil. */
  swipeable: { type: Boolean, default: false },
  /** Distancia (px) del gesto para confirmar apertura/cierre. */
  swipeThreshold: { type: Number, default: 50 },
  /** Zona (px) desde el borde donde inicia el gesto. */
  swipeEdgeSize: { type: Number, default: 30 },
  /** Transición del deslizamiento. */
  swipeTransition: { type: String, default: 'transition-transform duration-300 ease-in-out' },
  /** Tamaño del handle visible del gesto. */
  swipeHandleSize: { type: Number, default: 24 },
  /** Velocidad mínima del gesto para confirmar (px/ms). */
  swipeMinVelocity: { type: Number, default: 0.35 },
  /** Transición del scrim. */
  scrimTransition: { type: String, default: 'opacity 200ms ease' },
  /** Duración de la animación en ms. */
  animationDuration: { type: Number, default: 300 },
  /** Easing de la animación. */
  animationEasing: { type: String, default: 'ease-in-out' },
  /** Ancho visible cuando está cerrado (peek). */
  peekSize: { type: Number, default: 0 }
}
