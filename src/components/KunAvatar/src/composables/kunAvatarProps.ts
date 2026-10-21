import type { PropType } from 'vue';

export type KunAvatarDensity = 'default' | 'comfortable' | 'compact';
export type KunAvatarVariant = 'flat' | 'outlined' | 'tonal' | 'text';

export const kunAvatarProps = {
  /** URL de imagen a mostrar (tiene prioridad sobre icon/text/slot). */
  image: String,
  /** Ícono: alias `$nombre`, SVG inline, componente o texto libre (se muestra tal cual). */
  icon: { type: [String, Object, Function] as PropType<string | Record<string, any> | Function>, default: undefined },
  /** Texto (iniciales) a mostrar si no hay imagen ni ícono. */
  text: String,
  /** Texto alternativo de la imagen. */
  alt: String,
  /** Tamaño predefinido ('3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl') o px numéricos. */
  size: { type: [String, Number] as PropType<string | number>, default: "md" },
  /** Radio de borde: por defecto `rounded-full`; `false`/`'none'` → `rounded-none`; escala (`'md'`, `'lg'`, ...) → `rounded-<valor>`. */
  rounded: { type: [String, Number, Boolean], default: undefined },
  /** Borde: se renderiza como `border border-<valor>`. */
  border: { type: [String, Number, Boolean], default: false },
  /** Sufijo de color de fondo (`bg-<color>`). */
  color: { type: String, default: undefined },
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
  /** Variante visual: 'flat' (fondo pleno) | 'outlined' (transparente con borde) | 'tonal' (fondo suave) | 'text' (transparente). */
  variant: {
    type: String as PropType<KunAvatarVariant>,
    default: "flat",
    validator: (v: unknown) => ['flat', 'outlined', 'tonal', 'text'].includes(v as string),
  },
};
