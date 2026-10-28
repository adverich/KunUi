import type { PropType } from 'vue';
import { KUN_COLORS, KUN_VARIANTS, isKunColor, isKunVariant, type KunColor, type KunVariant } from '../../../../theme/kunVariants.js';

export type KunBtnSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type KunBtnType = 'button' | 'submit' | 'reset';
/** Redondeo propio: 'full' | 'none'. `undefined` hereda la escala global (`rounded-md`). */
export type KunBtnRounded = 'full' | 'none';

/** Tamaño: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'. */
const btnSizes: KunBtnSize[] = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

export const kunBtnProps = {
  /** Texto del botón (alternativa al slot default). */
  text: String,
  /** Tamaño: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'. */
  size: {
    type: String as PropType<KunBtnSize>,
    default: 'md',
    validator: (v: unknown) => btnSizes.includes(v as KunBtnSize)
  },
  /** Ancho mínimo (clase Tailwind). Solo aplica si no hay ancho custom. */
  minWidth: { type: String, default: 'min-w-[3rem]' },
  /** Peso del texto. */
  fontWeight: { type: String, default: 'font-medium' },
  /** Redondeo propio: 'full' | 'none'. `undefined` hereda la escala global. */
  rounded: {
    type: String as PropType<KunBtnRounded | null | undefined>,
    default: null,
    validator: (v: unknown) => v === null || v === undefined || ['full', 'none'].includes(v as string)
  },
  /** Alineación del texto. */
  textAlign: { type: String, default: 'text-center' },
  /** Color semántico: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'. `null` delega al theme global. */
  color: {
    type: String as PropType<KunColor | null>,
    default: null,
    validator: (v: unknown) => v === null || isKunColor(v)
  },
  /** Variante visual: 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost' | 'link'. `null` delega al theme global. */
  variant: {
    type: String as PropType<KunVariant | null>,
    default: null,
    validator: (v: unknown) => v === null || isKunVariant(v)
  },
  /** Tipo del botón nativo (submit envía formularios). */
  type: {
    type: String as PropType<KunBtnType>,
    default: 'button',
    validator: (v: unknown) => ['button', 'submit', 'reset'].includes(v as string)
  },
  /** Deshabilita el botón (también cuando loading). */
  disabled: Boolean,
  /** Muestra loader y bloquea interacción. */
  loading: Boolean,
  /** Ruta Vue Router (renderiza router-link en vez de button). */
  to: [String, Object],
  /** URL externa (renderiza <a> en vez de button). */
  href: String,
  /** Navegación con replace (solo con `to`). */
  replace: Boolean,
  /** Target del enlace (solo con `to`/`href`). */
  target: String,
  /** Anillo de foco accesible extra (además del outline del sistema). */
  ring: Boolean,
  /** Fuerza botón cuadrado: `aspect-square` + padding uniforme por tamaño (sin aplicar `minWidth`). Pensado para contenido por slot (p. ej. un solo ícono central); los botones con prop `icon` ya son cuadrados automáticos. */
  square: Boolean,
  /** Ícono central (solo visible si no hay `text` ni slot default). */
  icon: [Boolean, String, Function, Object, Array],
  /** Ícono a la izquierda del contenido. */
  prependIcon: [String, Function, Object, Array],
  /** Ícono a la derecha del contenido. */
  appendIcon: [String, Function, Object, Array],
  /** Tamaño del ícono (sobrescribe el calculado por `size`). */
  iconSize: { type: String as PropType<string | null>, default: null }
}

export { KUN_COLORS, KUN_VARIANTS };
