export const kunTextareaProps = {
  modelValue: [String, Number],

  // Etiqueta visible del textarea
  label: String,

  // Texto de ayuda o descripción secundaria
  hint: String,

  // Clases de estilo personalizadas
  class: String,
  bgColor: String,
  textColor: String,

  // Alineación de texto (left, center, right)
  textAlign: {
    type: String,
    default: 'left',
  },

  // Define si se debe mostrar el loader
  loading: Boolean,

  // Slot para ícono al comienzo
  prependInnerIcon: [String, Object, Function],
  // Slot para ícono al final
  appendInnerIcon: [String, Object, Function],

  // Slots adicionales
  loader: Boolean,
  hideDetails: Boolean,

  // Deshabilita la entrada
  disabled: Boolean,
  readonly: Boolean,

  // Valida errores sólo al blur (desenfocar)
  blurValidation: Boolean,

  // Validaciones
  rules: Array,
  errorMessages: [String, Array],
  maxErrors: Number,

  // Forzar estado de error visual
  error: Boolean,

  // Contador de caracteres
  counter: Boolean,
  maxLength: [Number, String],

  // Crecimiento dinámico
  autoGrow: Boolean,
  noResize: Boolean,
  maxRows: [Number, String], // aplica si autoGrow está activo

  // Atributos HTML nativos
  placeholder: String,
  name: String,
  id: String,
  autocomplete: String,
  rows: {
    type: [Number, String],
    default: 5,
  },
}
