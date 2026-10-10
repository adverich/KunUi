export const kunFormProps = {
  /** Espaciado vertical entre campos. */
  gap: {
    type: String,
    default: 'space-y-4'
  },
  /** Padding del formulario. */
  padding: {
    type: String,
    default: 'px-2 py-4'
  },
  /** Ancho máximo del formulario. */
  maxWidth: {
    type: String,
    default: 'max-w-full'
  },
  /** Validez agregada (v-model, se actualiza con validate()). */
  modelValue: {
    type: Boolean,
    default: true
  },
  /** Cuándo validar hijos: 'submit' | 'input'. */
  validateOn: {
    type: String,
    default: 'submit'
  }
}
