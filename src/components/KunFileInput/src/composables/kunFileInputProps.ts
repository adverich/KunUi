import type { PropType } from 'vue';

export const kunFileInputProps = {
  /** Archivo(s) seleccionado(s) (v-model): File único o array con `multiple`. `null` = sin selección (lo emite `clearable` en modo simple). */
  modelValue: { type: [File, Array] as PropType<File | File[] | null> },
  /** Permite seleccionar varios archivos. */
  multiple: Boolean,
  /** Muestra botón para limpiar la selección. */
  clearable: Boolean,
  /** Muestra los archivos como chips. */
  chips: Boolean,
  /** Muestra el tamaño total (true = base 1000, número = base custom). */
  showSize: [Boolean, Number],
  /** Etiqueta flotante. */
  label: String,
  /** Marca el campo como tocado desde el inicio. */
  dirty: {
    type: Boolean,
    default: true,
  },
  /** Deshabilita el campo. */
  disabled: Boolean,
  /** Estado de error visual. */
  error: Boolean,
  /** Mensajes de error externos. */
  errorMessages: [String, Array],
  /** Texto de ayuda. */
  hint: String,
  /** Muestra el hint siempre. */
  persistentHint: Boolean,
  /** Muestra contador de archivos. */
  counter: Boolean,
  /** Texto personalizado del contador. */
  counterString: String,
  /** Texto personalizado del tamaño total. */
  counterSizeString: String,
  /** Ícono externo al inicio. */
  prependIcon: [String, Object, Function, Array],
  /** Ícono externo al final. */
  appendIcon: [String, Object, Function, Array],
  /** Ícono interno al inicio. */
  prependInnerIcon: [String, Object, Function, Array],
  /** Ícono interno al final. */
  appendInnerIcon: [String, Object, Function, Array],
  /** Clase del contenedor del ícono interno inicial. */
  prependInnerClass: String,
  /** Clase del contenedor del ícono interno final. */
  appendInnerClass: String,
  /** Ícono del botón limpiar. */
  clearIcon: [String, Object, Function, Array],
  /** Tamaño de los íconos. */
  iconSize: {
    type: String,
    default: 'text-base',
  },
  /** Variante visual del contenedor. */
  variant: {
    type: String,
    default: 'filled',
  },
  /** Reglas de validación: `(valor) => true | string`. */
  rules: {
    type: Array,
    default: () => [],
  },
}
