import type { InjectionKey } from 'vue';

export interface KunDragAndDropContext {
    [key: string]: unknown;
}

export const KUN_DRAG_AND_DROP_KEY: InjectionKey<KunDragAndDropContext> = Symbol('kun-drag-and-drop')
