export const kunTableFooterProps = {
  itemsLength: { type: Number, default: 0 },
  itemsPerPage: { type: [Number, String], default: 10 },
  currentPage: { type: Number, default: 1 },
  pageOptions: { type: Array, default: () => [5, 10, 25, 50, 100] },
}
