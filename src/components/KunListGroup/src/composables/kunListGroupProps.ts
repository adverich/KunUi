export const kunListGroupProps = {
  /** Expansión del grupo (v-model). */
  modelValue: { type: Boolean, default: false },
  /** Id para aria-controls. Se genera uno si se omite. */
  id: { type: String, default: null },
  /** Título del activador (alternativa al slot). */
  title: { type: String, default: '' },
  /** Ícono cuando está expandido. */
  expandIcon: { type: String, default: '$mdi-chevron-up' },
  /** Ícono cuando está colapsado. */
  collapseIcon: { type: String, default: '$mdi-chevron-down' },
  /** Deshabilita el toggle. */
  disabled: { type: Boolean, default: false },
}
