import { inject } from 'vue'

/**
 * Clave del contexto que KunCarousel provee a todo su contenido
 * (slides, grillas, cards) para no cablear refs a mano.
 */
export const KUN_CAROUSEL_KEY = Symbol('kun-carousel')

/**
 * Accede al carousel ancestro más cercano.
 *
 * @returns {object|null} `{ api, didDrag, selectedIndex, isDragging, isSettled }`
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
export function useKunCarousel() {
  return inject(KUN_CAROUSEL_KEY, null)
}

export default useKunCarousel
