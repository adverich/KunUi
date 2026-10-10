import { inject, type InjectionKey, type Ref, type ComputedRef } from 'vue'

/**
 * Clave del contexto que KunCarousel provee a todo su contenido
 * (slides, grillas, cards) para no cablear refs a mano.
 */
export interface KunCarouselContext {
    api: Record<string, (...args: any[]) => unknown>;
    didDrag: Ref<boolean>;
    selectedIndex: Ref<number>;
    isDragging: Ref<boolean>;
    isSettled: Ref<boolean>;
}

export const KUN_CAROUSEL_KEY: InjectionKey<KunCarouselContext> = Symbol('kun-carousel')

/**
 * Accede al carousel ancestro más cercano.
 *
 * @returns `{ api, didDrag, selectedIndex, isDragging, isSettled }`
 * o `null` si no hay un KunCarousel ancestro.
 *
 * @example
 * <script setup>
 * import { useKunCarousel } from 'adverich-kun-ui'
 *
 * const carousel = useKunCarousel()
 *
 * function onCardClick(item) {
 *   // segunda capa anti-drag (la primera es la supresión automática
 *   // del click post-drag en el viewport): ignorar si venimos de un drag
 *   if (carousel?.didDrag.value) return
 *   openDetail(item)
 * }
 * </script>
 */
export function useKunCarousel(): KunCarouselContext | null {
  return inject(KUN_CAROUSEL_KEY, null)
}

export default useKunCarousel
