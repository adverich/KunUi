import type { PropType } from 'vue';

export type KunListSelectionMode = 'single' | 'multiple';

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
  /** Color de fondo del `<ul>`. */
  bgList: { type: String, default: 'bg-transparent' },
  /** Color de borde del `<ul>`. */
  borderColor: { type: String, default: 'border-ui' }
}
