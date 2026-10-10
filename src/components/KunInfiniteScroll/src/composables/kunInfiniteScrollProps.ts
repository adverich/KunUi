import type { PropType } from 'vue';

export const kunInfiniteScrollProps = {
  /** Lista completa (se pagina internamente por batches). */
  items: { type: Array as PropType<unknown[]>, default: () => [] as unknown[] },
  /** Texto de búsqueda (filtra antes de paginar). */
  search: String,
  /** Claves donde buscar (vacío = todas). Soporta rutas `a.b.c`. */
  searchableKeys: {
    type: Array,
    default: () => [],
  },
  /** Ítems que se agregan por intersección. */
  itemsPerIntersection: {
    type: Number,
    default: 20,
  },
  /** Activa la carga por scroll. */
  enabled: {
    type: Boolean,
    default: true,
  },
  /** Margen del observer respecto al viewport. */
  rootMargin: {
    type: String,
    default: '0px',
  },
  /** Renderiza con KunVirtualScroller en vez de lista plana. */
  virtual: {
    type: Boolean,
    default: false,
  },
  /** Altura estimada por ítem en modo virtual. */
  itemSize: {
    type: Number,
    default: 48,
  },
  /** Desplaza hasta este índice (carga batches hasta alcanzarlo). */
  scrollToIndex: {
    type: Number as PropType<number | null>,
    default: null,
  }
}
