export const kunRelationMatrixProps = {
  relationTitle: { type: String, default: 'Relaciones' },
  rows: Array,
  columns: Array,
  rowKey: { type: String, default: 'id' },
  columnKey: { type: String, default: 'id' },
  relationKey: { type: String, default: 'users' },
  rowLabel: String,
  columnLabel: String,
  relationDirection: {
    type: String,
    default: 'column',
    validator: v => ['column', 'row'].includes(v),
  },
  getRelatedEntities: Function,
  onToggleRelation: Function,
  returnObject: { type: Boolean, default: false },
}
