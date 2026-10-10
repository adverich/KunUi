import type { PropType } from 'vue';

export type MatrixRow = Record<string, unknown>;
export type KunRelationMatrixDirection = 'column' | 'row';

export const kunRelationMatrixProps = {
  relationTitle: { type: String, default: 'Relaciones' },
  rows: { type: Array as PropType<MatrixRow[]>, default: () => [] as MatrixRow[] },
  columns: { type: Array as PropType<MatrixRow[]>, default: () => [] as MatrixRow[] },
  rowKey: { type: String, default: 'id' },
  columnKey: { type: String, default: 'id' },
  relationKey: { type: String, default: 'users' },
  rowLabel: String,
  columnLabel: String,
  relationDirection: {
    type: String as PropType<KunRelationMatrixDirection>,
    default: 'column',
    validator: (v: unknown) => ['column', 'row'].includes(v as string),
  },
  getRelatedEntities: Function as unknown as () => ((row: MatrixRow, col: MatrixRow) => unknown[] | undefined),
  onToggleRelation: Function as unknown as () => ((payload: { row: MatrixRow; column: MatrixRow; hasRelation: boolean; existingRelationData: unknown }) => void),
  returnObject: { type: Boolean, default: false },
}
