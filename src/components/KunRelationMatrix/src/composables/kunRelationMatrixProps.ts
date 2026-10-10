import type { PropType } from 'vue';

export type MatrixRow = Record<string, unknown>;
export type KunRelationMatrixDirection = 'column' | 'row';

export const kunRelationMatrixProps = {
  /** Título de la sección de relaciones. */
  relationTitle: { type: String, default: 'Relaciones' },
  /** Filas de la matriz. */
  rows: { type: Array as PropType<MatrixRow[]>, default: () => [] as MatrixRow[] },
  /** Columnas de la matriz. */
  columns: { type: Array as PropType<MatrixRow[]>, default: () => [] as MatrixRow[] },
  /** Clave de identidad de cada fila. */
  rowKey: { type: String, default: 'id' },
  /** Clave de identidad de cada columna. */
  columnKey: { type: String, default: 'id' },
  /** Clave de la colección relacionada dentro de cada fila/columna. */
  relationKey: { type: String, default: 'users' },
  /** Campo a mostrar como etiqueta de fila. */
  rowLabel: String,
  /** Campo a mostrar como etiqueta de columna. */
  columnLabel: String,
  /** Eje de lectura de las relaciones. */
  relationDirection: {
    type: String as PropType<KunRelationMatrixDirection>,
    default: 'column',
    validator: (v: unknown) => ['column', 'row'].includes(v as string),
  },
  /** `(row, col) => relacionados | undefined`. Resuelve las entidades relacionadas de una celda. */
  getRelatedEntities: Function as unknown as () => ((row: MatrixRow, col: MatrixRow) => unknown[] | undefined),
  /** Callback al alternar una celda: `({ row, column, hasRelation, existingRelationData })`. */
  onToggleRelation: Function as unknown as () => ((payload: { row: MatrixRow; column: MatrixRow; hasRelation: boolean; existingRelationData: unknown }) => void),
  /** Si es true, emite objetos completos en lugar de claves. */
  returnObject: { type: Boolean, default: false },
}
