import type { PropType } from 'vue';

export type DragAndDropItemKey = string | ((item: unknown, index: number) => unknown);
export type KunDragAndDropLayout = 'list' | 'grid';
export type KunDragAndDropOrientation = 'vertical' | 'horizontal' | 'grid';

export const kunDragAndDropProps = {
  modelValue: {
    type: Array as PropType<unknown[]>,
    default: undefined,
  },
  items: {
    type: Array as PropType<unknown[]>,
    default: undefined,
  },
  itemKey: {
    type: [String, Function] as PropType<DragAndDropItemKey>,
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
    type: Function as unknown as PropType<((item: unknown, index: number) => boolean) | null>,
    default: null,
  },
  layout: {
    type: String as PropType<KunDragAndDropLayout>,
    default: 'list',
    validator: (v: unknown) => ['list', 'grid'].includes(v as string),
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
    type: Object as PropType<{ horizontal: number; vertical: number }>,
    default: () => ({ horizontal: 0, vertical: 0 }),
  },
  orientation: {
    type: String as PropType<KunDragAndDropOrientation | null>,
    default: null,
    validator: (v: unknown) => v == null || ['vertical', 'horizontal', 'grid'].includes(v as string),
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
  autoScroll: {
    type: Boolean,
    default: true,
  },
  scrollSensitivity: {
    type: Number,
    default: 50,
  },
  scrollSpeed: {
    type: Number,
    default: 12,
  },
}
