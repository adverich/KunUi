import type { PropType } from 'vue';

export type KunAppbarTitlePosition = 'left' | 'center' | 'right';
export type KunAppbarTransition = 'fade-slide' | 'fade' | 'scale';

export const kunAppbarProps = {
  /** Color de fondo. */
  bgColor: { type: String, default: 'bg-transparent' },
  /** Título (texto). */
  title: String,
  /** URL de imagen/logo junto al título. */
  titleImage: String,
  /** Tamaño del título (clase Tailwind). */
  titleSize: { type: String, default: 'text-base' },
  /** Peso del título (clase Tailwind). */
  titleWeight: { type: String, default: 'font-medium' },
  /** Posición del título. */
  titlePosition: {
    type: String as PropType<KunAppbarTitlePosition>,
    default: 'center',
    validator: (val: unknown) => ['left', 'center', 'right'].includes(val as string)
  },
  /** Densidad visual. */
  density: { type: String, default: 'default' },
  /** Altura (clase Tailwind). */
  height: String,
  /** Elevación/sombra. */
  elevation: { type: String, default: 'md' },
  /** Muestra borde inferior (usa `borderColor`). */
  bordered: { type: Boolean, default: false },
  /** Clases del borde inferior. */
  borderColor: { type: String, default: 'border-b border-ui' },
  /** Muestra el botón para abrir/cerrar el drawer. */
  showDrawerButton: { type: Boolean, default: true },
  /** Clase extra del botón del drawer. */
  buttonClass: { type: String, default: 'px-2' },
  /** Fondo del botón del drawer. */
  buttonBg: { type: String, default: 'bg-button-disabled opacity-75' },
  /** Clase de la sección izquierda (slot `left`). */
  leftSectionClass: { type: String, default: 'flex items-center gap-2' },
  /** Clase de la sección derecha (slot `right`). */
  rightSectionClass: { type: String, default: 'flex items-center gap-2 justify-end ml-auto' },
  /** Z-index. */
  zIndex: { type: String, default: 'z-1000' },
  /** Fija arriba con `fixed top-0 left-0 right-0`. */
  fixed: { type: Boolean, default: false },
  /** Fija arriba con `sticky top-0`. */
  sticky: { type: Boolean, default: false },
  /** Efecto cristal (`backdrop-blur-md`). */
  glass: { type: Boolean, default: false },
  /** Oculta la barra al hacer scroll hacia abajo. */
  autoHideOnScroll: { type: Boolean, default: false },
  /** Colapsa a modo compacto bajo `collapseBreakpoint` px de ancho. */
  responsiveCollapse: { type: Boolean, default: false },
  /** Ancho en px bajo el cual colapsa (requiere `responsiveCollapse`). */
  collapseBreakpoint: { type: Number, default: 768 },
  /** Transición de aparición. */
  transition: {
    type: String as PropType<KunAppbarTransition>,
    default: 'fade-slide',
    validator: (val: unknown) => ['fade-slide', 'fade', 'scale'].includes(val as string)
  },
  /** Clase de animación extra. */
  animationClass: { type: String, default: '' }
}
