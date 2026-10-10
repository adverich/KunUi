import type { PropType } from 'vue';

export type KunNumberFieldDensity = 'default' | 'comfortable' | 'compact';

export const KunNumberFieldProps = {
  // Core
  /** Valor numérico (v-model). `null` = vacío (también lo emite `onClear`). */
  modelValue: { type: [Number, String] as PropType<number | string | null>, default: null },
  /** Declarada pero sin efecto: el input es siempre `text` (el formateo custom es incompatible con `number` nativo). */
  type: { type: String, default: 'text' },
  /** Placeholder. Si existe, el label flota siempre. */
  placeholder: { type: [String, Number], default: '' },
  /** Etiqueta flotante (mismo sistema que KunTextField). */
  label: { type: String, default: '' },
  /** Color del label en reposo. */
  labelColor: { type: String, default: 'text-ui' },
  /** Color del label flotando (null = usa `labelColor`). */
  floatingLabelColor: { type: String, default: null },
  /** Tamaño del label en reposo. */
  labelSize: { type: String, default: 'text-sm' },
  /** Tamaño del label flotando. */
  floatingLabelSize: { type: String, default: 'text-xs' },
  /** Opacidad del label en reposo. */
  labelOpacity: { type: String, default: 'opacity-60' },
  /** Opacidad del label flotando. */
  floatingLabelOpacity: { type: String, default: 'opacity-80' },
  /** Offset izquierdo en reposo (null = automático según iconos). */
  labelLeft: { type: String, default: null },
  /** Offset izquierdo flotando. */
  floatingLabelLeft: { type: String, default: 'left-2' },
  /** Posición superior flotando. */
  floatingLabelTop: { type: String, default: '-top-2' },
  /** Clase libre para el label. */
  labelClass: { type: String, default: '' },
  /** Marca el campo como tocado (flota el label). */
  dirty: { type: Boolean, default: false },

  // Decoradores
  /** Texto fijo al inicio. */
  prefix: { type: String, default: '' },
  /** Texto fijo al final. */
  suffix: { type: String, default: '' },
  /** Ícono externo al inicio (fuera del borde). Legacy: ver `prependInnerIcon`. */
  prependIcon: String,
  /** Ícono externo al final (fuera del borde). Legacy: ver `appendInnerIcon`. */
  appendIcon: String,
  /** Ícono interno al inicio. */
  prependInnerIcon: { type: [String, Object, Function, Array], default: null },
  /** Ícono interno al final. */
  appendInnerIcon: { type: [String, Object, Function, Array], default: null },
  /** Clase del contenedor del ícono interno inicial. */
  prependInnerClass: String,
  /** Clase del contenedor del ícono interno final. */
  appendInnerClass: String,

  // Estilo y diseño
  /** Redondeo del contenedor. */
  rounded: { type: String, default: 'rounded' },
  /** Color del borde. */
  borderColor: { type: String, default: 'border-ui' },
  /** Color del texto del valor. */
  textColor: { type: String, default: 'text-ui' },
  /** Tamaño del texto del valor (null = 'text-sm'). */
  inputTextSize: { type: String, default: null },
  /** Peso del texto del valor (null = hereda). */
  inputWeight: { type: String, default: null },
  /** Color del placeholder. */
  placeholderColor: { type: String, default: 'placeholder-ui' },
  /** Tamaño del placeholder ('text-lg' o 'placeholder:text-lg'). */
  placeholderTextSize: { type: String, default: null },
  /** Clase libre para el input. */
  inputStyle: { type: String, default: '' },
  /** Color de fondo del contenedor. */
  bgInput: { type: String, default: 'bg-field-background' },
  /** Centra el texto del valor. */
  textCenter: { type: Boolean, default: false },
  /** Variante de botones de incremento: 'default' | 'stacked' | 'split'. */
  controlVariant: { type: String, default: 'default' },
  /** Oculta los botones ▲▼ (quedan `onIncrement`/`onDecrement` por slot). */
  noArrows: { type: Boolean, default: false },
  /** Densidad del padding y alturas (misma escala que KunTextField). */
  density: {
    type: String as PropType<KunNumberFieldDensity>,
    default: 'default',
    validator: (v: unknown) => ['default', 'comfortable', 'compact'].includes(v as string),
  },

  // Estado
  /** Estado de error visual. */
  error: { type: Boolean, default: false },
  /** Mensajes de error externos. */
  errorMessages: [String, Array],
  /** Reglas de validación: `(valor) => true | string`. */
  rules: { type: Array, default: () => [] },
  // Atributos HTML nativos
  /** Id del input nativo. */
  id: { type: String, default: null },
  /** Nombre del input nativo. */
  name: { type: String, default: null },
  /** Autocomplete nativo. */
  autocomplete: { type: String, default: 'off' },
  /** Teclado virtual en móvil ('decimal' muestra teclado numérico). */
  inputmode: { type: String, default: 'decimal' },
  /** Requerido (nativo + validación). */
  required: { type: Boolean, default: false },
  /** Deshabilita el campo. */
  disabled: { type: Boolean, default: false },
  /** Solo lectura. */
  readonly: { type: Boolean, default: false },
  /** Muestra botón limpiar. */
  clearable: { type: Boolean, default: false },
  /** Longitud máxima nativa (activa el counter). */
  maxlength: { type: [Number, String], default: null },
  /** Muestra contador (requiere `maxlength`). */
  counter: { type: Boolean, default: false },
  /** Debounce en ms para emitir el modelo. */
  debounce: { type: Number, default: 300 },

  // Ayuda y detalles
  /** Texto de ayuda. */
  hint: { type: String, default: '' },
  /** Muestra el hint siempre. */
  persistentHint: { type: Boolean, default: false },
  /** Oculta el área de detalles. */
  hideDetails: { type: Boolean, default: false },
  /** Valida solo al perder el foco. */
  validateOnBlur: { type: Boolean, default: false },

  // Reglas numéricas
  /** Valor mínimo (clamp + flechas). Acepta -Infinity. */
  min: { type: [Number, String], default: -Infinity },
  /** Valor máximo (clamp + flechas). Acepta Infinity. */
  max: { type: [Number, String], default: Infinity },
  /** Paso de incremento/decremento. */
  step: { type: [Number, String], default: 1 },
  /** Locale de formato (null = global, default 'es-AR'). */
  locale: { type: String as PropType<string | null>, default: null },
  /** Separador decimal de entrada. */
  separator: { type: String, default: ',' },
  /** Agrupa miles al mostrar. */
  useGrouping: { type: Boolean, default: true },
  /** Decimales de formato y edición. */
  precision: { type: [Number, String], default: 2 },

  /** Modo de entrada: 'natural' (libre) | 'bank' (estricto, cursor controlado). */
  formatMode: {
    type: String,
    default: 'natural', // 'bank' | 'natural'
  },
};
