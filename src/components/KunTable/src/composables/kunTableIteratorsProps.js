export const kunTableIteratorsProps = {
  items: Array,
  headers: Array,
  isExpanded: Function,
  isSelected: Function,
  showExpand: Boolean,
  showSelect: Boolean,
  hasActions: Boolean,
  actionLoadingMap: Object,
  itemKey: {
    type: Function,
    default: (_, index) => index,
  },
  customSlots: Object,
}
