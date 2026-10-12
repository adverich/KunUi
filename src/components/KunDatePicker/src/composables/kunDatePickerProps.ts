import type { PropType } from 'vue';

export type KunDatePickerMode = 'date' | 'datetime' | 'time';
export type KunDatePickerAlign = 'left' | 'center' | 'right';

export const kunDatePickerProps = {
  /** Fecha seleccionada (v-model): Date, string o array de 2 en modo rango. */
  modelValue: { type: [Date, Array, String] as PropType<Date | unknown[] | string | null>, default: null },
  /** Id del input (se genera uno si se omite). */
  id: { type: String as PropType<string | null>, default: null },
  /** Selección de rango (emite array de 2 fechas). */
  range: { type: Boolean, default: false },
  /** Etiqueta del campo. */
  label: { type: String, default: '' },
  /** Placeholder del campo. */
  placeholder: { type: String, default: '' },
  /** Solo muestra el botón de calendario (sin campo de texto). */
  onlyIcon: { type: Boolean, default: false },
  /** Deshabilita el control. */
  disabled: { type: Boolean, default: false },
  /** Mensaje de error bajo el campo. */
  errorMessage: { type: String, default: '' },
  /** Aplica la selección sin botón Aplicar. */
  autoApply: { type: Boolean, default: true },
  /** Modo: 'date' | 'datetime' | 'time'. */
  mode: {
    type: String as PropType<KunDatePickerMode>,
    default: 'date',
    validator: (v: unknown) => ['date', 'datetime', 'time'].includes(v as string)
  },
  /** Habilita selector de hora (atajo de mode='datetime'). */
  enableTime: { type: Boolean, default: false },
  /** Habilita segundos en el selector de hora. */
  enableSeconds: { type: Boolean, default: false },
  /** Fecha inicial del calendario. */
  startDate: { type: [Date, String] as PropType<Date | string | null>, default: null },
  /** Hora inicial ('HH:mm' u objeto). */
  startTime: { type: [String, Object] as PropType<string | Record<string, any> | null>, default: null },
  /** Fecha mínima seleccionable. */
  minDate: { type: Date as PropType<Date | null>, default: null },
  /** Fecha máxima seleccionable. */
  maxDate: { type: Date as PropType<Date | null>, default: null },
  /** Locale de nombres de mes/día. */
  locale: { type: String, default: 'es-ES' },
  /** Zona horaria IANA para formateo (e.g. 'America/Argentina/Buenos_Aires'). */
  timezone: { type: String as PropType<string | null>, default: null }, // e.g., 'America/Argentina/Buenos_Aires'
  /** Formato del valor emitido (tokens YYYY/MM/DD/HH/mm/ss). */
  valueFormat: { type: String as PropType<string | null>, default: null },
  /** Formato legacy (alias de valueFormat/displayFormat). */
  format: { type: String as PropType<string | null>, default: null },
  /** Formato del texto visible. */
  displayFormat: { type: String as PropType<string | null>, default: null },
  /** Formatos por canal: { input, value, display }. */
  formats: { type: Object as PropType<Record<string, any> | null>, default: () => null },
  /** Formato de salida: 'date' | 'datetime' | 'time' | 'iso' o custom. */
  outputFormat: { type: String as PropType<string | null>, default: null }, // 'date' | 'datetime' | 'time' | 'iso'
  /** Ancho del campo. */
  width: { type: [String, Number] as PropType<string | number | null>, default: null },
  /** Ancho del calendario en px. */
  calendarWidth: { type: [String, Number], default: 320 },
  /** El campo ocupa todo el ancho. */
  fullWidth: { type: Boolean, default: false },
  /** Alineación del popover: 'left' | 'center' | 'right'. */
  align: {
    type: String as PropType<KunDatePickerAlign>,
    default: 'left',
    validator: (v: unknown) => ['left', 'center', 'right'].includes(v as string)
  },
  /** Tamaño de cada día. */
  daySize: { type: String, default: '2rem' },
  /** Tamaño de fuente del calendario. */
  fontSize: { type: String, default: '0.875rem' },
  /** Altura máxima del popover. */
  maxHeight: { type: String, default: '400px' },
  /** Clase extra del input. */
  inputClass: { default: '' },
  /** Clase extra del diálogo. */
  dialogClass: { default: '' },
  /** Props que se reenvían al KunTextField interno. */
  inputProps: { type: Object, default: () => ({}) },
  /** Props que se reenvían a los KunNumberField de hora. */
  timeFieldProps: { type: Object, default: () => ({}) },
}
