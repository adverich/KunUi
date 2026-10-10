# KunCarousel

> Embla-style carousel, native with no dependencies.
>
> Carrusel estilo Embla, nativo sin dependencias.

## Uso · Usage

```vue
<script setup>
import { KunCarousel } from 'adverich-kun-ui'
</script>

<template>
  <KunCarousel />
</template>
```

> Con `app.use(KunUI)` el componente queda registrado globalmente y no hace falta importarlo. · With `app.use(KunUI)` the component is globally registered, no import needed.

## Props

| Propiedad · Prop | Tipo · Type | Defecto · Default | Descripción · Description |
|---|---|---|---|
| `modelValue` | `Number` | `-` | Índice del snap seleccionado (v-model). |
| `align` | `KunCarouselAlign \| KunCarouselAlignFn` | `'center'` | Alineación de los slides dentro del viewport: 'start' \| 'center' \| 'end' |
| `axis` | `KunCarouselAxis` | `'x'` | Eje de scroll: 'x' horizontal \| 'y' vertical<br/>Valores · Values: `x` `y` |
| `direction` | `KunCarouselDirection` | `'ltr'` | Dirección del contenido: 'ltr' \| 'rtl'<br/>Valores · Values: `ltr` `rtl` |
| `containScroll` | `KunCarouselContainScroll` | `'trimSnaps'` | Cómo contener el scroll sobrante al inicio/fin. false \| 'trimSnaps' (solo snaps que scrollean) \| 'keepSnaps' (conserva todos) |
| `slidesToScroll` | `KunCarouselSlidesToScroll` | `1` | Cantidad de slides por avance. Número entero o 'auto' (agrupa por vista). |
| `dragFree` | `Boolean` | `false` | Scroll libre con momento (ignora skipSnaps cuando es true). |
| `dragThreshold` | `Number` | `10` | Distancia mínima en px para que un pointerdown se considere drag. |
| `loop` | `Boolean` | `false` | Loop infinito. Requiere suficientes slides; si no, hace fallback a false. |
| `skipSnaps` | `Boolean` | `false` | Permite saltear snaps si el drag es vigoroso (ignorado con dragFree). |
| `duration` | `Number` | `25` | Duración base de la animación de scroll (ms, usada como factor de transición). |
| `startSnap` | `Number` | `0` | Snap inicial seleccionado (v9). |
| `startIndex` | `Number` | `-` | Alias v8 de startSnap. Si se define, tiene prioridad. |
| `active` | `Boolean` | `true` | Si es false, el carousel queda inactivo (sin drag ni animación). |
| `draggable` | `Boolean` | `true` | Habilita el drag con puntero (v9). |
| `watchDrag` | `Boolean \| Function` | `-` | Alias v8 de draggable. Si se define, tiene prioridad. |
| `resize` | `Boolean` | `true` | Re-calcula tamaños con ResizeObserver (v9). |
| `watchResize` | `Boolean \| Function` | `-` | Alias v8 de resize. |
| `focus` | `Boolean` | `true` | Mueve el carousel al foco de un slide (v9). |
| `watchFocus` | `Boolean \| Function` | `-` | Alias v8 de focus. |
| `slideChanges` | `Boolean` | `true` | Observa altas/bajas de slides vía MutationObserver (v9). |
| `watchSlides` | `Boolean \| Function` | `-` | Alias v8 de slideChanges. |
| `inViewThreshold` | `Number` | `0` | Umbral de visibilidad para slidesInView (0 - 1). |
| `inViewMargin` | `String` | `'0px'` | Margen del observer de visibilidad (sintaxis CSS margin). |
| `breakpoints` | `Object` | `() => ({})` | Opciones responsive por media query. @example { '(min-width: 768px)': { slidesToScroll: 2, align: 'start' } } Solo se admiten como override: align, slidesToScroll, dragFree, loop, skipSnaps, containScroll, duration, axis, direction. |
| `slideSize` | `String` | `'100%'` | Tamaño base de cada slide (flex-basis). Ej: '100%', '50%', '33.333%', '300px'. |
| `gap` | `String` | `'1rem'` | Espacio entre slides (clase Tailwind gap o valor CSS). |
| `height` | `String` | `'400px'` | Altura del viewport cuando axis === 'y'. |
| `showArrows` | `Boolean` | `true` | Muestra flechas prev/next. |
| `showDots` | `Boolean` | `true` | Muestra dots de navegación. |
| `arrowsPosition` | `KunCarouselArrowsPosition` | `'sides'` | Posición de las flechas: 'sides' (flotantes) \| 'bottom' (barra inferior).<br/>Valores · Values: `sides` `bottom` |
| `stopOnInteraction` | `Boolean` | `true` | Detiene el autoplay al interactuar (pointerdown / foco). |
| `stopOnMouseEnter` | `Boolean` | `false` | Detiene el autoplay al pasar el mouse por encima. |
| `playOnInit` | `Boolean` | `true` | Inicia el autoplay al montar. |
| `autoplay` | `Boolean` | `false` | Activa el autoplay integrado (equivale al plugin embla-carousel-autoplay). |
| `autoplayDelay` | `Number` | `3000` | Intervalo del autoplay en ms. |
| `autoplayDirection` | `KunCarouselAutoplayDirection` | `1` | Dirección del autoplay: 1 avanza, -1 retrocede. |
| `keyboard` | `Boolean` | `true` | Habilita navegación con teclado (flechas) cuando el viewport tiene foco. |
| `viewportClass` | `String \| Array \| Object` | `''` | Clase extra del viewport. |
| `containerClass` | `String \| Array \| Object` | `''` | Clase extra del container (track). |
| `arrowClass` | `String \| Array \| Object` | `''` | Clase extra de cada flecha. |
| `dotsClass` | `String \| Array \| Object` | `''` | Clase extra del contenedor de dots. |
| `wrapperClass` | `String \| Array \| Object` | `''` | Clase extra del wrapper raíz. |

## Eventos · Events

- `update:modelValue`
- `select`
- `settle`
- `scroll`
- `reinit`
- `destroy`
- `pointerdown`
- `pointermove`
- `pointerup`
- `slidesinview`
- `slideschanged`
- `slidefocus`
- `autoplay:play`
- `autoplay:stop`
- `autoplay:interaction`

## Slots

- `#default`
- `#prev`
- `#next`
- `#dots`

## Métodos expuestos · Exposed

- `goToNext()`
- `goToPrev()`
- `goTo()`
- `canGoToNext()`
- `canGoToPrev()`
- `selectedSnap()`
- `previousSnap()`
- `snapList()`
- `snapIndex()`
- `scrollProgress()`
- `slidesInView()`
- `slidesNotInView()`
- `reInit()`
- `destroy()`
- `rootNode()`
- `containerNode()`
- `slideNodes()`
- `play()`
- `stop()`
- `scrollNext()`
- `scrollPrev()`
- `scrollTo()`
- `canScrollNext()`
- `canScrollPrev()`
- `selectedScrollSnap()`
- `previousScrollSnap()`
- `scrollSnapList()`
- `selectedIndex()`
- `previousIndex()`
- `snaps()`
- `inView()`
- `progress()`
- `canPrev()`
- `canNext()`
- `isDragging()`
- `isSettled()`
- `didDrag()`
- `autoplayPlaying()`
- `options()`
- `effectiveOptions()`

## Notas · Notes

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

---

_Generado por · Generated by `scripts/generate-docs.ts`. No editar a mano · Do not edit by hand._

Machine-readable: `registry.json` → `KunCarousel`.
