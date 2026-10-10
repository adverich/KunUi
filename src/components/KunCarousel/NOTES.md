## Paridad Embla

Mismas opciones del core v9 (con alias v8), nativo sin dependencias:
`startIndex`→`startSnap`, `watchDrag`→`draggable`, `watchResize`→`resize`,
`watchFocus`→`focus`, `watchSlides`→`slideChanges`.

## Métodos vía ref (paridad Embla)

`goToNext`, `goToPrev`, `goTo`, `canGoToNext`, `canGoToPrev`,
`selectedSnap`, `previousSnap`, `snapList`, `snapIndex`, `scrollProgress`,
`slidesInView`, `slidesNotInView`, `reInit`, `destroy`, `rootNode`,
`containerNode`, `slideNodes`, `play`, `stop` — más alias v8 (`scrollNext`,
`scrollPrev`, `scrollTo`, `canScrollNext`, `canScrollPrev`,
`selectedScrollSnap`, `previousScrollSnap`, `scrollSnapList`).

## Clicks post-drag

Se suprimen automáticamente en captura. El contenido puede usar
`useKunCarousel()` (inyecta `{ api, didDrag, selectedIndex, isDragging,
isSettled }`) para no cablear refs en grillas/cards.

## Showcase

`/examples/KunCarousel` es una única página con todos los demos juntos
(Default, Loop, RightToLeft, SlidesToScroll, DragFree, Align,
VariableWidths, YAxis, SlidesPerView, Thumbnails, Hover Split, Responsive,
Autoplay, Flechas/Dots personalizados, Progress, LazyLoad), cada uno con
snippet. Los demos viven en `src/components/KunCarousel/examples/_demos/`
(no ruteados) y `examples/` contiene solo `Default.vue`, que los apila.
