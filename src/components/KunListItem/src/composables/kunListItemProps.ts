import type { PropType } from 'vue';
import { isKunColor, isKunVariant, type KunColor, type KunVariant } from '../../../../theme/kunVariants.js';

export type KunListItemColor = KunColor | null;
export type KunListItemVariant = KunVariant;
export type KunListItemDensity = 'default' | 'comfortable' | 'compact';

export const kunListItemProps = {
  /** Valor del ítem (selección y eventos). Acepta cualquier tipo. */
  value: [String, Number, Boolean, Object, Array, null],
  /** Ruta Vue Router (renderiza router-link). */
  to: [String, Object],
  /** URL externa (renderiza <a>). */
  href: String,
  /** Navegación con replace (solo con `to`). */
  replace: Boolean,
  /** Coincidencia exacta de ruta activa. */
  /** Tag del contenedor. */
  tag: { type: String, default: 'li' },
  /** Deshabilita el ítem. */
  disabled: Boolean,
  /** Marca el ítem como activo. */
  active: Boolean,
  /** Permite selección (emite toggle al contexto KunList). */
  selectable: { type: Boolean, default: false },
  /** Color semántico del item. `null` hereda el color resuelto de la KunList contenedora. */
  color: { type: String as PropType<KunListItemColor>, default: null, validator: (v: unknown) => v === null || isKunColor(v) },
  /** Variante visual (matriz `KunColor x KunVariant` de `kunVariants.ts`). */
  variant: { type: String as PropType<KunListItemVariant>, default: 'ghost', validator: (v: unknown) => isKunVariant(v) },
  /** Densidad del padding vertical. */
  density: { type: String as PropType<KunListItemDensity>, default: 'default', validator: (v: unknown) => ['default', 'comfortable', 'compact'].includes(v as string) },
  /** Redondeo de escala (`rounded-md`). `tile` lo anula. */
  rounded: { type: Boolean, default: true },
  /** Sin redondeo. */
  tile: Boolean,
  /** Efecto ripple al hacer click. */
  ripple: { type: [Boolean, Object], default: true },
  /** Sin padding horizontal. */
  noGutters: Boolean,
  /** Alineación vertical del contenido. */
  itemPosition: { type: String, default: 'items-start' },
  /** Ícono al inicio (string, componente o slot `prepend`). */
  prependIcon: [String, Object, Function],
  /** Avatar al inicio (URL de imagen). */
  prependAvatar: String,
  /** Clase del contenedor del prepend. */
  prependClass: String,
  /** Ícono al final (string, componente o slot `append`). */
  appendIcon: [String, Object, Function],
  /** Avatar al final (URL de imagen). */
  appendAvatar: String,
  /** Clase del contenedor del append. */
  appendClass: String,
  /** Título (alternativa al slot). */
  title: [String, Number, Boolean],
  /** Clase del título. */
  titleClass: { type: String, default: 'font-medium' },
  /** Subtítulo (alternativa al slot). */
  subtitle: [String, Number, Boolean],
  /** Clase del subtítulo. */
  subtitleClass: { type: String, default: 'text-sm text-muted' },
  /** Clase extra del contenedor. */
  containerClass: { type: [String, Array, Object], default: '' },
  /** Id del ítem (se genera uno si se omite). */
  id: [String, Number],
}
