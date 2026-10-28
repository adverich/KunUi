import type { PropType } from 'vue';
import { KUN_SIZE_ORDER, type KunSize } from '../../../../theme/kunSizes.js';
import { isKunColor, isKunVariant, type KunColor, type KunVariant } from '../../../../theme/kunVariants.js';

export type KunAvatarDensity = 'default' | 'comfortable' | 'compact';
export type KunAvatarVariant = KunVariant;
/** Escala canónica (`xxs`…`xxl`) + alias legacy (`3xs`, `2xs`, `2xl`, `3xl`). */
export type KunAvatarSize = KunSize | '3xs' | '2xs' | '2xl' | '3xl';
/** Rol de token del borde (--kun-border*): `default` | `muted` | `accented` | `inverted`. */
export type KunAvatarBorder = boolean | 'default' | 'muted' | 'accented' | 'inverted';

const avatarSizes: string[] = [...KUN_SIZE_ORDER, '3xs', '2xs', '2xl', '3xl'];
const borderRoles = ['default', 'muted', 'accented', 'inverted'];

export const kunAvatarProps = {
  /** URL de imagen a mostrar (tiene prioridad sobre icon/text/slot). */
  image: String,
  /** Ícono: alias `$nombre`, SVG inline, componente o texto libre (se muestra tal cual). */
  icon: { type: [String, Object, Function] as PropType<string | Record<string, any> | Function>, default: undefined },
  /** Texto (iniciales) a mostrar si no hay imagen ni ícono. */
  text: String,
  /** Texto alternativo de la imagen. */
  alt: String,
  /** Tamaño: escala canónica ('xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'), alias legacy ('3xs' | '2xs' | '2xl' | '3xl') o px numéricos. */
  size: {
    type: [String, Number] as PropType<KunAvatarSize | number>,
    default: "md",
    validator: (v: unknown) =>
      typeof v === 'number' ||
      (typeof v === 'string' && (avatarSizes.includes(v) || /^\d+$/.test(v))),
  },
  /** Radio de borde: por defecto `rounded-full`; `false`/`'none'` → `rounded-none`; escala (`'md'`, `'lg'`, ...) → `rounded-<valor>`. */
  rounded: { type: [String, Number, Boolean], default: undefined },
  /**
   * Borde con rol de token: `true` | `'default'` | `'muted'` | `'accented'` | `'inverted'`
   * → `border border-<rol>`. Nunca un color de paleta crudo (eso lo porta `color`).
   */
  border: {
    type: [String, Boolean] as PropType<KunAvatarBorder>,
    default: false,
    validator: (v: unknown) => v === false || (typeof v === 'string' && borderRoles.includes(v)),
  },
  /** Color semántico; `null` hereda `kunTheme.configure({ defaults: { avatar } })` (fallback `neutral`). */
  color: { type: String as PropType<KunColor | null>, default: null, validator: (v: unknown) => v === null || isKunColor(v) },
  /** Densidad: escala el tamaño del avatar (comfortable −1 paso, compact −2 pasos). */
  density: {
    type: String as PropType<KunAvatarDensity>,
    default: "default",
    validator: (v: unknown) => ['default', 'comfortable', 'compact'].includes(v as string),
  },
  /** Margen al final (útil en listas). */
  end: Boolean,
  /** Margen al inicio (útil en listas). */
  start: Boolean,
  /** Tag del contenedor. */
  tag: { type: String, default: "div" },
  /** Tema de color (hook de clase `theme-<valor>` para CSS del consumidor). */
  theme: String,
  /** Sin redondeo (esquinas rectas). */
  tile: Boolean,
  /** Variante estándar (`KunVariant`): solid | outline | soft | subtle | ghost | link. Null hereda theme (`avatar`, fallback `soft`). */
  variant: {
    type: String as PropType<KunVariant | null>,
    default: null,
    validator: (v: unknown) => v === null || isKunVariant(v),
  },
};
