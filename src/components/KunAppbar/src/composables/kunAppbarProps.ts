import type { PropType } from 'vue';
import { isKunColor, isKunVariant, type KunColor, type KunVariant } from '../../../../theme/kunVariants.js';

export type KunAppbarTitlePosition = 'left' | 'center' | 'right';
export type KunAppbarTransition = 'fade-slide' | 'fade' | 'scale';
export type KunAppbarDensity = 'default' | 'comfortable' | 'compact';
export type KunAppbarElevation = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none';

export const kunAppbarProps = {
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
  density: {
    type: String as PropType<KunAppbarDensity>,
    default: 'default',
    validator: (v: unknown) => ['default', 'comfortable', 'compact'].includes(v as string)
  },
  /** Altura (clase Tailwind). */
  height: String,
  /** Elevación/sombra. */
  elevation: {
    type: String as PropType<KunAppbarElevation>,
    default: 'md',
    validator: (v: unknown) => ['sm', 'md', 'lg', 'xl', '2xl', 'none'].includes(v as string)
  },
  /** Muestra borde inferior (`border-b border-default`). Por defecto `true` (igual que el header de Nuxt UI). */
  bordered: { type: Boolean, default: true },
  /** Muestra el botón para abrir/cerrar el drawer. */
  showDrawerButton: { type: Boolean, default: true },
  /** Clase extra del botón del drawer. */
  buttonClass: { type: String, default: 'px-2' },
  /** Color del botón del drawer. `null` delega al theme global. */
  buttonColor: {
    type: String as PropType<KunColor | null>,
    default: null,
    validator: (v: unknown) => v === null || isKunColor(v)
  },
  /** Variante del botón del drawer. `null` delega al theme global. */
  buttonVariant: {
    type: String as PropType<KunVariant | null>,
    default: null,
    validator: (v: unknown) => v === null || isKunVariant(v)
  },
  /** Clase de la sección izquierda (slot `left`). */
  leftSectionClass: { type: String, default: 'flex items-center gap-2' },
  /** Clase de la sección derecha (slot `right`). */
  rightSectionClass: { type: String, default: 'flex items-center gap-2 justify-end ml-auto' },
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
