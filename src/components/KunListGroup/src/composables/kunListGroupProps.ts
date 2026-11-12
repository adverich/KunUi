import type { PropType } from 'vue';

export const kunListGroupProps = {
  /** Expansión del grupo (v-model). */
  modelValue: { type: Boolean, default: false },
  /** Id para aria-controls. Se genera uno si se omite. */
  id: { type: String as PropType<string | null>, default: null },
  /** Título del activador (alternativa al slot). */
  title: { type: String, default: '' },
  /** Ícono cuando está expandido. Acepta alias `$` del set bundleado, clase CSS o SVG. */
  expandIcon: { type: String, default: '$menuUpOutline' },
  /** Ícono cuando está colapsado. Acepta alias `$` del set bundleado, clase CSS o SVG. */
  collapseIcon: { type: String, default: '$menuDownOutline' },
  /** Deshabilita el toggle. */
  disabled: { type: Boolean, default: false },
}
