export type KunNumberFieldDensity = 'default' | 'comfortable' | 'compact';
export type KunNumberFieldControlVariant = 'default' | 'stacked' | 'split';
export type KunNumberFieldFormatMode = 'natural' | 'bank';
export type KunNumberFieldInputmode =
  | 'none'
  | 'text'
  | 'decimal'
  | 'numeric'
  | 'tel'
  | 'search'
  | 'email'
  | 'url';

export interface KunNumberFieldProps {
  /** Valor numérico (v-model). `null` = vacío (también lo emite `onClear`). */
  modelValue?: number | string | null;
  /** Declarada pero sin efecto: el input es siempre `text` (el formateo custom es incompatible con `number` nativo). */
  type?: string;
  /** Placeholder. Si existe, el label flota siempre. */
  placeholder?: string | number;
  /** Etiqueta flotante (mismo sistema que KunTextField). */
  label?: string;
  /** Color del label en reposo. */
  labelColor?: string;
  /** Color del label flotando (null = usa `labelColor`). */
  floatingLabelColor?: string | null;
  /** Tamaño del label en reposo. */
  labelSize?: string;
  /** Tamaño del label flotando. */
  floatingLabelSize?: string;
  /** Opacidad del label en reposo. */
  labelOpacity?: string;
  /** Opacidad del label flotando. */
  floatingLabelOpacity?: string;
  /** Offset izquierdo en reposo (null = automático según iconos). */
  labelLeft?: string | null;
  /** Offset izquierdo flotando. */
  floatingLabelLeft?: string;
  /** Posición superior flotando. */
  floatingLabelTop?: string;
  /** Clase libre para el label. */
  labelClass?: string;
  /** Marca el campo como tocado (flota el label). */
  dirty?: boolean;

  /** Texto fijo al inicio. */
  prefix?: string;
  /** Texto fijo al final. */
  suffix?: string;
  /** Ícono externo al inicio (fuera del borde). Legacy: ver `prependInnerIcon`. */
  prependIcon?: string;
  /** Ícono externo al final (fuera del borde). Legacy: ver `appendInnerIcon`. */
  appendIcon?: string;
  /** Ícono interno al inicio. */
  prependInnerIcon?: string | Record<string, any> | Function | unknown[] | null;
  /** Ícono interno al final. */
  appendInnerIcon?: string | Record<string, any> | Function | unknown[] | null;
  /** Clase del contenedor del ícono interno inicial. */
  prependInnerClass?: string;
  /** Clase del contenedor del ícono interno final. */
  appendInnerClass?: string;

  /** Redondeo del contenedor. */
  rounded?: string;
  /** Color del borde. */
  borderColor?: string;
  /** Color del texto del valor. */
  textColor?: string;
  /** Tamaño del texto del valor (null = 'text-sm'). */
  inputTextSize?: string | null;
  /** Peso del texto del valor (null = hereda). */
  inputWeight?: string | null;
  /** Color del placeholder. */
  placeholderColor?: string;
  /** Tamaño del placeholder ('text-lg' o 'placeholder:text-lg'). */
  placeholderTextSize?: string | null;
  /** Clase libre para el input. */
  inputStyle?: string;
  /** Color de fondo del contenedor. */
  bgInput?: string;
  /** Centra el texto del valor. */
  textCenter?: boolean;
  /** Variante de botones de incremento: 'default' | 'stacked' | 'split'. */
  controlVariant?: KunNumberFieldControlVariant;
  /** Oculta los botones ▲▼ (quedan `onIncrement`/`onDecrement` por slot). */
  noArrows?: boolean;
  /** Densidad del padding y alturas (misma escala que KunTextField). */
  density?: KunNumberFieldDensity;

  /** Estado de error visual. */
  error?: boolean;
  /** Mensajes de error externos. */
  errorMessages?: string | string[];
  /** Reglas de validación: `(valor) => true | string`. */
  rules?: Array<(value: any) => boolean | string>;

  /** Id del input nativo. */
  id?: string | null;
  /** Nombre del input nativo. */
  name?: string | null;
  /** Autocomplete nativo. */
  autocomplete?: string;
  /** Teclado virtual en móvil ('decimal' muestra teclado numérico). */
  inputmode?: KunNumberFieldInputmode;
  /** Requerido (nativo + validación). */
  required?: boolean;
  /** Deshabilita el campo. */
  disabled?: boolean;
  /** Solo lectura. */
  readonly?: boolean;
  /** Muestra botón limpiar. */
  clearable?: boolean;
  /** Longitud máxima nativa (activa el counter). */
  maxlength?: number | string | null;
  /** Muestra contador (requiere `maxlength`). */
  counter?: boolean;
  /** Debounce en ms para emitir el modelo. */
  debounce?: number;

  /** Texto de ayuda. */
  hint?: string;
  /** Muestra el hint siempre. */
  persistentHint?: boolean;
  /** Oculta el área de detalles. */
  hideDetails?: boolean;
  /** Valida solo al perder el foco. */
  validateOnBlur?: boolean;

  /** Valor mínimo (clamp + flechas). Acepta -Infinity. */
  min?: number | string;
  /** Valor máximo (clamp + flechas). Acepta Infinity. */
  max?: number | string;
  /** Paso de incremento/decremento. */
  step?: number | string;
  /** Locale de formato (null = global, default 'es-AR'). */
  locale?: string | null;
  /** Separador decimal de entrada (típico ',' o '.'). */
  separator?: string;
  /** Agrupa miles al mostrar. */
  useGrouping?: boolean;
  /** Decimales de formato y edición. */
  precision?: number | string;
  /** Modo de entrada: 'natural' (libre) | 'bank' (estricto, cursor controlado). */
  formatMode?: KunNumberFieldFormatMode;
}

/**
 * Defaults runtime para `withDefaults(defineProps<KunNumberFieldProps>(), ...)`.
 * Sin `validator`: los conjuntos cerrados se validan por unión literal TS
 * (autocompletado + error en editor) en lugar de warn runtime.
 */
export const kunNumberFieldDefaults = {
  modelValue: null,
  type: 'text',
  placeholder: '',
  label: '',
  labelColor: 'text-ui',
  floatingLabelColor: null,
  labelSize: 'text-sm',
  floatingLabelSize: 'text-xs',
  labelOpacity: 'opacity-60',
  floatingLabelOpacity: 'opacity-80',
  labelLeft: null,
  floatingLabelLeft: 'left-2',
  floatingLabelTop: '-top-2',
  labelClass: '',
  dirty: false,
  prefix: '',
  suffix: '',
  prependInnerIcon: null,
  appendInnerIcon: null,
  rounded: 'rounded',
  borderColor: 'border-ui',
  textColor: 'text-ui',
  inputTextSize: null,
  inputWeight: null,
  placeholderColor: 'placeholder-ui',
  placeholderTextSize: null,
  inputStyle: '',
  bgInput: 'bg-field-background',
  textCenter: false,
  controlVariant: 'default' as KunNumberFieldControlVariant,
  noArrows: false,
  density: 'default' as KunNumberFieldDensity,
  error: false,
  rules: () => [],
  id: null,
  name: null,
  autocomplete: 'off',
  inputmode: 'decimal' as KunNumberFieldInputmode,
  required: false,
  disabled: false,
  readonly: false,
  clearable: false,
  maxlength: null,
  counter: false,
  debounce: 300,
  hint: '',
  persistentHint: false,
  hideDetails: false,
  validateOnBlur: false,
  min: -Infinity,
  max: Infinity,
  step: 1,
  locale: null,
  separator: ',',
  useGrouping: true,
  precision: 2,
  formatMode: 'natural' as KunNumberFieldFormatMode,
};
