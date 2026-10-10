export const kunClockProps = {
  /** Color del texto (cualquier valor CSS). */
  color: {
    type: String,
    default: 'inherit',
  },
  /** Tamaño del texto (cualquier valor CSS). */
  size: {
    type: String,
    default: '1rem',
  },
  /** Reservado para formato de hora. Actualmente sin efecto (siempre HH:mm:ss 24h). */
  format: {
    type: String,
    default: 'HH:mm:ss',
  }
}
