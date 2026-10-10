import type { PropType } from 'vue';

export interface TableFilterDefinition {
    /** Clave de la columna a filtrar (coincide con `header.value`). */
    value: string;
    /** Etiqueta visible. */
    label?: string;
    /** Título alternativo. */
    title?: string;
    /** Texto alternativo. */
    text?: string;
    /** Nombre para textos genéricos. */
    name?: string;
    /** Opciones seleccionables del filtro. */
    items?: unknown[];
    /** Clave de comparación dentro de cada opción (default `'id'`). */
    'item-value'?: string;
    /** Placeholder del selector. */
    placeholderText?: string;
    /** Texto cuando no hay opciones. */
    textNoItem?: string;
    [key: string]: unknown;
}

export const kunTableFilterProps = {
  /** Visibilidad del modal de filtros (v-model). */
  modelValue: Boolean,
  /** Definiciones de filtros por columna. */
  filters: { type: Array as PropType<TableFilterDefinition[]>, default: () => [] as TableFilterDefinition[] },
  /** Valores activos por columna (`{ [value]: seleccionados }`), sincronizado con KunTable. */
  activeFilters: { type: Object as PropType<Record<string, unknown>>, default: () => ({}) },
}
