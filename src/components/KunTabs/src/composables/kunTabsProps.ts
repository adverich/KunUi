export const kunTabsProps = {
  /** Tab activo (v-model): valor o array con `multiple`. */
  modelValue: [String, Number, Array],
  /** Reservado para tabs por datos. Actualmente sin efecto (usar slots KunTab o items de KunTabWindow). */
  items: Array,
  /** Alineación de los tabs. */
  alignTabs: { type: String, default: 'start' },
  /** Dirección del layout: 'horizontal' | 'vertical'. */
  direction: { type: String, default: 'horizontal' },
  /** Color de fondo de la barra. */
  bgColor: { type: String, default: '' },
  /** Color de los tabs. */
  color: String,
  /** Color del slider indicador. */
  sliderColor: { type: String, default: 'bg-primary' },
  /** Clase del tab activo. */
  selectedClass: { type: String, default: 'text-primary font-medium' },
  /** Los tabs ocupan todo el ancho. */
  grow: Boolean,
  /** Ancho fijo por tab (sin scroll). */
  fixedTabs: Boolean,
  /** Desplaza el tab activo al centro. */
  centerActive: Boolean,
  /** Oculta el slider indicador. */
  hideSlider: Boolean,
  /** Muestra flechas de scroll. */
  showArrows: Boolean,
  /** Ícono de flecha siguiente. */
  nextIcon: { type: String, default: 'ri-arrow-right-s-line' },
  /** Ícono de flecha anterior. */
  prevIcon: { type: String, default: 'ri-arrow-left-s-line' },
  /** Altura de la barra. */
  height: [String, Number],
  /** Selección múltiple. */
  multiple: Boolean,
  /** Siempre hay un tab seleccionado. */
  mandatory: {
    type: [Boolean, String],
    default: false,
  },
}
