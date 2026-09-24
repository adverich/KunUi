export const kunDragAndDropProps = {
  modelValue: {
    type: Array,
    default: undefined,
  },
  items: {
    type: Array,
    default: undefined,
  },
  itemKey: {
    type: [String, Function],
    default: 'id',
  },
  group: {
    type: String,
    default: null,
  },
  sortable: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  dragHandle: {
    type: String,
    default: null,
  },
  itemDraggable: {
    type: Function,
    default: null,
  },
  layout: {
    type: String,
    default: 'list',
    validator: (v) => ['list', 'grid'].includes(v),
  },
  draggingClass: {
    type: String,
    default: '',
  },
  dropZoneClass: {
    type: String,
    default: 'kun-dnd-drop-zone',
  },
  threshold: {
    type: Object,
    default: () => ({ horizontal: 0, vertical: 0 }),
  },
  orientation: {
    type: String,
    default: null,
    validator: (v) => v == null || ['vertical', 'horizontal', 'grid'].includes(v),
  },
  tag: {
    type: String,
    default: 'div',
  },
  wrapperClass: {
    type: String,
    default: '',
  },
  gridClass: {
    type: String,
    default: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3',
  },
  listClass: {
    type: String,
    default: 'flex flex-col gap-2',
  },
}
