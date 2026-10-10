export const kunTableFooterProps = {
  /** Total de ítems (para el contador "1-10 de N"). */
  itemsLength: { type: Number, default: 0 },
  /** Ítems por página (v-model del selector). */
  itemsPerPage: { type: [Number, String], default: 10 },
  /** Página actual (v-model). */
  currentPage: { type: Number, default: 1 },
  /** Total de páginas (null = se calcula). */
  totalPages: { type: Number, default: null },
  /** Primer índice visible (null = se calcula). */
  from: { type: Number, default: null },
  /** Último índice visible (null = se calcula). */
  to: { type: Number, default: null },
  /** Opciones del selector de ítems por página. */
  pageOptions: { type: Array, default: () => [5, 10, 25, 50, 100] },
}
