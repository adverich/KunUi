import type { PropType } from 'vue';

export const kunCurrencyProps = {
  /** Moneda `{ value, name, symbol }`. Si es null usa la config global. */
  currency: {
    type: Object as PropType<Record<string, any> | null>,
    default: null,
  },
  /** Oculta el símbolo/prefijo de moneda. */
  hideCurrency: {
    type: Boolean,
    default: false
  },
  /** Locale de formato (null = config global, default 'es-AR'). */
  locale: {
    type: String as PropType<string | null>,
    default: null
  },
  /** Decimales (null = config global, default 2). */
  precision: {
    type: Number as PropType<number | null>,
    default: null,
  },
  /** Valor numérico (v-model). */
  modelValue: {
    type: [Number, String] as PropType<number | string | null>,
    default: null,
  },
  /** Placeholder del input. */
  placeholder: {
    type: String,
    default: '0.00'
  },
  /** Texto fijo al inicio. */
  prefix: {
    type: String as PropType<string | null>,
    default: null
  },
  /** Texto fijo al final. */
  suffix: {
    type: String,
    default: ''
  },
}
