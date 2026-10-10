/**
 * Props de KunCarousel.
 *
 * Replica las opciones del core de Embla Carousel (v9, con alias v8)
 * y añade extras de UI (flechas, dots, autoplay integrado, tamaño de slide).
 *
 * Referencia: https://www.embla-carousel.com/docs/api/options
 */
import type { PropType } from 'vue';

export type KunCarouselAlign = 'start' | 'center' | 'end';
export type KunCarouselAlignFn = (viewSize: number, slideSize: number, index: number) => number;
export type KunCarouselAxis = 'x' | 'y';
export type KunCarouselDirection = 'ltr' | 'rtl';
export type KunCarouselContainScroll = false | 'trimSnaps' | 'keepSnaps';
export type KunCarouselSlidesToScroll = number | 'auto';
export type KunCarouselArrowsPosition = 'sides' | 'bottom';
export type KunCarouselAutoplayDirection = 1 | -1;

export const kunCarouselProps = {
  // ------------------------------------------------------------------
  // v-model: snap seleccionado (índice dentro de snapList())
  // ------------------------------------------------------------------
  modelValue: {
    type: Number,
    default: undefined,
  },

  // ------------------------------------------------------------------
  // Opciones core Embla
  // ------------------------------------------------------------------

  /** Alineación de los slides dentro del viewport: 'start' | 'center' | 'end' */
  align: {
    type: [String, Function] as PropType<KunCarouselAlign | KunCarouselAlignFn>,
    default: 'center',
    validator: (v: unknown) => typeof v === 'function' || ['start', 'center', 'end'].includes(v as string),
  },

  /** Eje de scroll: 'x' horizontal | 'y' vertical */
  axis: {
    type: String as PropType<KunCarouselAxis>,
    default: 'x',
    validator: (v: unknown) => ['x', 'y'].includes(v as string),
  },

  /** Dirección del contenido: 'ltr' | 'rtl' */
  direction: {
    type: String as PropType<KunCarouselDirection>,
    default: 'ltr',
    validator: (v: unknown) => ['ltr', 'rtl'].includes(v as string),
  },

  /**
   * Cómo contener el scroll sobrante al inicio/fin.
   * false | 'trimSnaps' (solo snaps que scrollean) | 'keepSnaps' (conserva todos)
   */
  containScroll: {
    type: [String, Boolean] as PropType<KunCarouselContainScroll>,
    default: 'trimSnaps',
    validator: (v: unknown) => v === false || ['trimSnaps', 'keepSnaps'].includes(v as string),
  },

  /** Cantidad de slides por avance. Número entero o 'auto' (agrupa por vista). */
  slidesToScroll: {
    type: [Number, String] as PropType<KunCarouselSlidesToScroll>,
    default: 1,
    validator: (v: unknown) => v === 'auto' || (Number.isInteger(v) && (v as number) >= 1),
  },

  /** Scroll libre con momento (ignora skipSnaps cuando es true). */
  dragFree: {
    type: Boolean,
    default: false,
  },

  /** Distancia mínima en px para que un pointerdown se considere drag. */
  dragThreshold: {
    type: Number,
    default: 10,
  },

  /** Loop infinito. Requiere suficientes slides; si no, hace fallback a false. */
  loop: {
    type: Boolean,
    default: false,
  },

  /** Permite saltear snaps si el drag es vigoroso (ignorado con dragFree). */
  skipSnaps: {
    type: Boolean,
    default: false,
  },

  /** Duración base de la animación de scroll (ms, usada como factor de transición). */
  duration: {
    type: Number,
    default: 25,
  },

  /** Snap inicial seleccionado (v9). */
  startSnap: {
    type: Number,
    default: 0,
  },

  /** Alias v8 de startSnap. Si se define, tiene prioridad. */
  startIndex: {
    type: Number,
    default: undefined,
  },

  /** Si es false, el carousel queda inactivo (sin drag ni animación). */
  active: {
    type: Boolean,
    default: true,
  },

  /** Habilita el drag con puntero (v9). */
  draggable: {
    type: Boolean,
    default: true,
  },

  /** Alias v8 de draggable. Si se define, tiene prioridad. */
  watchDrag: {
    type: [Boolean, Function],
    default: undefined,
  },

  /** Re-calcula tamaños con ResizeObserver (v9). */
  resize: {
    type: Boolean,
    default: true,
  },

  /** Alias v8 de resize. */
  watchResize: {
    type: [Boolean, Function],
    default: undefined,
  },

  /** Mueve el carousel al foco de un slide (v9). */
  focus: {
    type: Boolean,
    default: true,
  },

  /** Alias v8 de focus. */
  watchFocus: {
    type: [Boolean, Function],
    default: undefined,
  },

  /** Observa altas/bajas de slides vía MutationObserver (v9). */
  slideChanges: {
    type: Boolean,
    default: true,
  },

  /** Alias v8 de slideChanges. */
  watchSlides: {
    type: [Boolean, Function],
    default: undefined,
  },

  /** Umbral de visibilidad para slidesInView (0 - 1). */
  inViewThreshold: {
    type: Number,
    default: 0,
  },

  /** Margen del observer de visibilidad (sintaxis CSS margin). */
  inViewMargin: {
    type: String,
    default: '0px',
  },

  /**
   * Opciones responsive por media query.
   * @example { '(min-width: 768px)': { slidesToScroll: 2, align: 'start' } }
   * Solo se admiten como override: align, slidesToScroll, dragFree,
   * loop, skipSnaps, containScroll, duration, axis, direction.
   */
  breakpoints: {
    type: Object,
    default: () => ({}),
  },

  // ------------------------------------------------------------------
  // Extras KunUI (no forman parte del core Embla)
  // ------------------------------------------------------------------

  /** Tamaño base de cada slide (flex-basis). Ej: '100%', '50%', '33.333%', '300px'. */
  slideSize: {
    type: String,
    default: '100%',
  },

  /** Espacio entre slides (clase Tailwind gap o valor CSS). */
  gap: {
    type: String,
    default: '1rem',
  },

  /** Altura del viewport cuando axis === 'y'. */
  height: {
    type: String,
    default: '400px',
  },

  /** Muestra flechas prev/next. */
  showArrows: {
    type: Boolean,
    default: true,
  },

  /** Muestra dots de navegación. */
  showDots: {
    type: Boolean,
    default: true,
  },

  /** Posición de las flechas: 'sides' (flotantes) | 'bottom' (barra inferior). */
  arrowsPosition: {
    type: String as PropType<KunCarouselArrowsPosition>,
    default: 'sides',
    validator: (v: unknown) => ['sides', 'bottom'].includes(v as string),
  },

  /** Detiene el autoplay al interactuar (pointerdown / foco). */
  stopOnInteraction: {
    type: Boolean,
    default: true,
  },

  /** Detiene el autoplay al pasar el mouse por encima. */
  stopOnMouseEnter: {
    type: Boolean,
    default: false,
  },

  /** Inicia el autoplay al montar. */
  playOnInit: {
    type: Boolean,
    default: true,
  },

  /** Activa el autoplay integrado (equivale al plugin embla-carousel-autoplay). */
  autoplay: {
    type: Boolean,
    default: false,
  },

  /** Intervalo del autoplay en ms. */
  autoplayDelay: {
    type: Number,
    default: 3000,
  },

  /** Dirección del autoplay: 1 avanza, -1 retrocede. */
  autoplayDirection: {
    type: Number as PropType<KunCarouselAutoplayDirection>,
    default: 1,
    validator: (v: unknown) => [1, -1].includes(v as number),
  },

  /** Habilita navegación con teclado (flechas) cuando el viewport tiene foco. */
  keyboard: {
    type: Boolean,
    default: true,
  },

  /** Clase extra del viewport. */
  viewportClass: {
    type: [String, Array, Object],
    default: '',
  },

  /** Clase extra del container (track). */
  containerClass: {
    type: [String, Array, Object],
    default: '',
  },

  /** Clase extra de cada flecha. */
  arrowClass: {
    type: [String, Array, Object],
    default: '',
  },

  /** Clase extra del contenedor de dots. */
  dotsClass: {
    type: [String, Array, Object],
    default: '',
  },

  /** Clase extra del wrapper raíz. */
  wrapperClass: {
    type: [String, Array, Object],
    default: '',
  },
}

export default kunCarouselProps
