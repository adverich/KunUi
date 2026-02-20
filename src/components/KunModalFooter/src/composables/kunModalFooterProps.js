export const kunModalFooterProps = {
  modelValue: {
    type: Boolean,
    required: true,
  },
  id: {
    type: Number,
  },
  message: {
    type: String,
    default: "Mensaje predeterminado",
  },
  color: {
    type: String,
    default: "green",
  },
  width: {
    type: String,
    default: "300px",
  },
  height: {
    type: String,
    default: "auto",
  },
  isFixed: {
    type: Boolean,
    default: false,
  },
}
