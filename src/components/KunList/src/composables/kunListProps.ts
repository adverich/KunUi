import type { PropType } from 'vue';
import { isKunColor, isKunVariant, type KunColor, type KunVariant } from '../../../../theme/kunVariants.js';

export type KunListSelectionMode = 'single' | 'multiple';
export type KunListColor = KunColor | null;
export type KunListVariant = KunVariant | null;

export const kunListProps = {
  /** Estilo de navegación (padding + rounded). */
  nav: Boolean,
  /** Estilo de sublista (sangría + borde lateral). */
  sub: Boolean,
  /** Espaciado compacto entre ítems. */
  dense: Boolean,
  /** Habilita selección de ítems (v-model `selected`). */
  selectable: { type: Boolean, default: false },
  /** Modo de selección (requiere `selectable`). */
  selectionMode: {
    type: String as PropType<KunListSelectionMode>,
    default: 'single',
    validator: (v: unknown) => ['single', 'multiple'].includes(v as string),
  },
  /** Tamaño de fuente de la lista (clase Tailwind). */
  fontSize: { type: String, default: 'text-base' },
  /** Color semántico del contenedor (fondo de superficie). `null` delega a `theme.defaults.list`. */
  color: { type: String as PropType<KunListColor>, default: null, validator: (v: unknown) => v === null || isKunColor(v) },
  /** Variante del contenedor (pinta fondo/ring de superficie; los ítems heredan el color). `null` delega a `theme.defaults.list`. */
  variant: { type: String as PropType<KunListVariant>, default: null, validator: (v: unknown) => v === null || isKunVariant(v) },
  /** Clase Tailwind libre de fondo (ej. `bg-sky-900/60`). Si está, gana sobre `color`/`variant` para el fondo del contenedor. */
  bg: { type: String as PropType<string | null>, default: null },
}