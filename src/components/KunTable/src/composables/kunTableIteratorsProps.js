export const kunTableIteratorsProps = {
  items: Array,
  headers: Array,
  isExpanded: Function,
  isSelected: Function,
  showExpand: Boolean,
  showSelect: Boolean,
  hasActions: Boolean,
  actionLoadingMap: Object,
  getActionLoading: {
    type: Function,
    default: () => false,
  },
  itemKey: {
    type: Function,
    default: (_, index) => index,
  },
  customSlots: Object,
}
