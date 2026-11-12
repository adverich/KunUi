import type { PropType } from 'vue';

export type KunRadioGroupDirection = 'vertical' | 'horizontal';

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
  direction: {
    type: String as PropType<KunRadioGroupDirection>,
    default: 'vertical',
    validator: (v: unknown) => ['vertical', 'horizontal'].includes(v as string),
  },
  /** Opciones en línea (atajo de direction='horizontal'). */
  inline: Boolean,
  /** Estado de error visual. */
  error: Boolean,
  /** Ícono por defecto para el estado activo. Acepta alias `$` del set bundleado, componente o clase CSS. */
  trueIcon: { type: [String, Object], default: '$radioboxMarked' },
  /** Ícono por defecto para el estado inactivo. Acepta alias `$` del set bundleado, componente o clase CSS. */
  falseIcon: { type: [String, Object], default: '$radioboxBlank' },
  /** Etiqueta del grupo. */
  label: String,
}
