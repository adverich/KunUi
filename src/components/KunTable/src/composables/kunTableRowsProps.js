export const kunTableRowsProps = {
  items: Array,
  tbodyClass: String,
  isExpanded: {
    type: Function,
    required: true,
  },
  isSelected: {
    type: Function,
    required: true,
  },
  itemKey: {
    type: Function,
    default: (_, index) => index,
  },
  headers: Array,
  showExpand: Boolean,
  showSelect: Boolean,
  hasActions: Boolean,
  loading: Boolean,
  actionLoadingMap: Object,
  customSlots: Object,
}
