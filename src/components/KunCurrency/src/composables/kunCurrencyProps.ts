export const kunCurrencyProps = {
  /** Moneda `{ value, name, symbol }`. Si es null usa la config global. */
  currency: {
    type: Object,
    default: null,
  },
  /** Oculta el símbolo/prefijo de moneda. */
  hideCurrency: {
    type: Boolean,
    default: false
  },
  /** Locale de formato (null = config global, default 'es-AR'). */
  locale: {
    type: String,
    default: null
  },
  /** Decimales (null = config global, default 2). */
  precision: {
    type: Number,
    default: null,
  },
  /** Valor numérico (v-model). */
  modelValue: {
    default: null,
  },
  /** Placeholder del input. */
  placeholder: {
    type: String,
    default: '0.00'
  },
  /** Texto fijo al inicio. */
  prefix: {
    type: String,
    default: null
  },
  /** Texto fijo al final. */
  suffix: {
    type: String,
    default: ''
  },
}
