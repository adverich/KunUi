import type { ComputedRef, Ref } from 'vue';
import type { InjectionKey } from 'vue';

/** Forma del contexto proveído por `KunDragAndDrop` (paridad con `DragItemContext` del ítem). */
export interface KunDragAndDropContext {
    resolveKey?: (item: unknown, index: number) => unknown;
    draggingKey?: Ref<unknown> | ComputedRef<unknown>;
    armedKey?: Ref<unknown>;
    hasDragHandle?: Ref<boolean> | ComputedRef<boolean>;
    draggingClass?: Ref<string> | ComputedRef<string>;
    dropZoneClass?: Ref<string> | ComputedRef<string>;
    disabled?: Ref<boolean> | ComputedRef<boolean>;
    sortable?: Ref<boolean> | ComputedRef<boolean>;
    itemDraggable?: ((item: unknown, index: number) => boolean) | null;
    [key: string]: unknown;
}

export const KUN_DRAG_AND_DROP_KEY: InjectionKey<KunDragAndDropContext> = Symbol('kun-drag-and-drop')
