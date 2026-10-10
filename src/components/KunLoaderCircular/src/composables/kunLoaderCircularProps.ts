export const kunLoaderCircularProps = {
  /** Overlay de pantalla completa (teleport a body). */
  fullscreen: {
    type: Boolean,
    default: false,
  },
  /** Diámetro en px. */
  size: {
    type: [Number, String],
    default: 24,
  },
  /** Grosor del anillo en px. */
  width: {
    type: [Number, String],
    default: 4,
  },
  /** Gradiente cónico del anillo. */
  gradient: {
    type: String,
    default: 'conic-gradient(from 0deg, var(--surface-raised), var(--primary))',
  },
};
