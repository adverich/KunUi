import type { PropType } from 'vue';

export const kunRadioGroupProps = {
  /** Valor seleccionado (v-model). Acepta `null` (nada seleccionado). */
  modelValue: { type: [String, Number, Boolean, Object] as PropType<string | number | boolean | Record<string, unknown> | null> },
  /** Color de la opción seleccionada. */
  color: String,
  /** Color base de las no seleccionadas. */
  baseColor: String,
  /** Nombre del grupo (inputs nativos). */
  name: String,
  /** Deshabilita todas las opciones. */
  disabled: Boolean,
  /** Solo lectura. */
  readonly: Boolean,
  /** Dirección del layout: 'vertical' | 'horizontal'. */
  direction: { type: String, default: 'vertical' },
  /** Opciones en línea (atajo de direction='horizontal'). */
  inline: Boolean,
  /** Estado de error visual. */
  error: Boolean,
  /** Ícono por defecto para el estado activo. */
  trueIcon: { type: [String, Object], default: 'mdi-radiobox-marked' },
  /** Ícono por defecto para el estado inactivo. */
  falseIcon: { type: [String, Object], default: 'mdi-radiobox-blank' },
  /** Etiqueta del grupo. */
  label: String,
}
