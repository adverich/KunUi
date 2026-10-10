import type { PropType } from 'vue';

export type DragAndDropItemKey = string | ((item: unknown, index: number) => unknown);
export type KunDragAndDropLayout = 'list' | 'grid';
export type KunDragAndDropOrientation = 'vertical' | 'horizontal' | 'grid';

export const kunDragAndDropProps = {
  /** Lista ordenada (v-model). Es la fuente de verdad del orden. */
  modelValue: {
    type: Array as PropType<unknown[]>,
    default: undefined,
  },
  /** Alias de `modelValue` (v-model:items). */
  items: {
    type: Array as PropType<unknown[]>,
    default: undefined,
  },
  /** Clave estable por ítem: campo o función `(item, index) => key`. */
  itemKey: {
    type: [String, Function] as PropType<DragAndDropItemKey>,
    default: 'id',
  },
  /** Grupo para transferir ítems entre listas con el mismo nombre. */
  group: {
    type: String,
    default: null,
  },
  /** Permite reordenar dentro de la lista. */
  sortable: {
    type: Boolean,
    default: true,
  },
  /** Desactiva todo el drag and drop. */
  disabled: {
    type: Boolean,
    default: false,
  },
  /** Selector CSS del handle (null = toda la tarjeta arrastra). */
  dragHandle: {
    type: String,
    default: null,
  },
  /** `(item) => boolean`: decide qué ítems se pueden arrastrar. */
  itemDraggable: {
    type: Function as unknown as PropType<((item: unknown, index: number) => boolean) | null>,
    default: null,
  },
  /** Layout visual: 'list' | 'grid' (solo CSS, el orden lo manda el array). */
  layout: {
    type: String as PropType<KunDragAndDropLayout>,
    default: 'list',
    validator: (v: unknown) => ['list', 'grid'].includes(v as string),
  },
  /** Clase extra del ítem mientras se arrastra. */
  draggingClass: {
    type: String,
    default: '',
  },
  /** Clase del placeholder de destino. */
  dropZoneClass: {
    type: String,
    default: 'kun-dnd-drop-zone',
  },
  /** Umbral de movimiento para confirmar el sort ({ horizontal, vertical } px). */
  threshold: {
    type: Object as PropType<{ horizontal: number; vertical: number }>,
    default: () => ({ horizontal: 0, vertical: 0 }),
  },
  /** Orientación del cálculo de inserción (null = según `layout`). */
  orientation: {
    type: String as PropType<KunDragAndDropOrientation | null>,
    default: null,
    validator: (v: unknown) => v == null || ['vertical', 'horizontal', 'grid'].includes(v as string),
  },
  /** Tag del contenedor. */
  tag: {
    type: String,
    default: 'div',
  },
  /** Clase extra del contenedor. */
  wrapperClass: {
    type: String,
    default: '',
  },
  /** Clases del layout en modo grid. */
  gridClass: {
    type: String,
    default: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3',
  },
  /** Clases del layout en modo lista. */
  listClass: {
    type: String,
    default: 'flex flex-col gap-2',
  },
  /** Auto-scroll al acercar el puntero a los bordes del contenedor con scroll. */
  autoScroll: {
    type: Boolean,
    default: true,
  },
  /** Distancia (px) al borde para iniciar el auto-scroll. */
  scrollSensitivity: {
    type: Number,
    default: 50,
  },
  /** Velocidad del auto-scroll por frame. */
  scrollSpeed: {
    type: Number,
    default: 12,
  },
}
