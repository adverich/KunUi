# KunCarousel

Carousel inspirado en [Embla Carousel](https://github.com/davidjerleke/embla-carousel):
mismas opciones y configuraciones del core, implementado de forma nativa en Vue
(sin dependencias externas).

```vue
<script setup>
import { ref } from 'vue'
import { KunCarousel, KunCarouselSlide } from 'adverich-kun-ui'

const selected = ref(0)
const slides = ref([...])
</script>

<template>
  <KunCarousel v-model="selected" align="center" loop>
    <KunCarouselSlide v-for="s in slides" :key="s.id">
      <img :src="s.src" class="h-56 w-full object-cover rounded-xl" />
    </KunCarouselSlide>
  </KunCarousel>
</template>
```

## Opciones (paridad Embla v9)

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| modelValue | Number | - | v-model: índice del snap seleccionado |
| align | String/Function | 'center' | 'start', 'center', 'end' o función `(viewSize, slideSize, index) => offset` |
| axis | String | 'x' | 'x' horizontal, 'y' vertical |
| direction | String | 'ltr' | 'ltr' \| 'rtl' |
| containScroll | String/Boolean | 'trimSnaps' | false \| 'trimSnaps' \| 'keepSnaps' |
| slidesToScroll | Number/String | 1 | Entero o 'auto' (agrupa por vista) |
| dragFree | Boolean | false | Scroll libre con momento |
| dragThreshold | Number | 10 | px mínimos para iniciar el drag |
| loop | Boolean | false | Navegación infinita (wrap por índice) |
| skipSnaps | Boolean | false | Saltea snaps con drags vigorosos |
| duration | Number | 25 | Factor de animación (≈ duration × 16 ms) |
| startSnap | Number | 0 | Snap inicial (v9) |
| startIndex | Number | - | Alias v8 de startSnap |
| active | Boolean | true | Si es false, el carousel queda inactivo |
| draggable | Boolean | true | Habilita drag por puntero (v9) |
| watchDrag | Boolean | - | Alias v8 de draggable |
| resize | Boolean | true | Re-mide con ResizeObserver (v9) |
| watchResize | Boolean | - | Alias v8 de resize |
| focus | Boolean | true | Navega al foco de un slide (v9) |
| watchFocus | Boolean | - | Alias v8 de focus |
| slideChanges | Boolean | true | Observa altas/bajas de slides (v9) |
| watchSlides | Boolean | - | Alias v8 de slideChanges |
| inViewThreshold | Number | 0 | Umbral de visibilidad (0-1) |
| inViewMargin | String | '0px' | rootMargin del observer |
| breakpoints | Object | {} | Overrides por media query, ej. `{ '(min-width: 768px)': { slidesToScroll: 2 } }` |

Claves admitidas en `breakpoints`: align, slidesToScroll, dragFree, loop,
skipSnaps, containScroll, duration, axis, direction.

## Extras KunUI

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| slideSize | String | '100%' | flex-basis de cada slide ('50%', '300px', 'auto'...) |
| gap | String | '1rem' | Espacio entre slides |
| height | String | '400px' | Altura del viewport con axis="y" |
| showArrows | Boolean | true | Flechas prev/next |
| showDots | Boolean | true | Dots de navegación |
| arrowsPosition | String | 'sides' | 'sides' (flotantes) \| 'bottom' (barra inferior) |
| autoplay | Boolean | false | Autoplay integrado (equivale al plugin de Embla) |
| autoplayDelay | Number | 3000 | Intervalo en ms |
| autoplayDirection | Number | 1 | 1 avanza, -1 retrocede |
| playOnInit | Boolean | true | Inicia el autoplay al montar |
| stopOnInteraction | Boolean | true | Detiene el autoplay ante interacción |
| stopOnMouseEnter | Boolean | false | Pausa el autoplay con hover |
| keyboard | Boolean | true | Flechas/Home/End con el viewport enfocado |
| viewportClass / containerClass / arrowClass / dotsClass / wrapperClass | String/Array/Object | '' | Clases extra |

## Métodos (vía ref, paridad Embla)

v9: `goToNext(instant?)`, `goToPrev(instant?)`, `goTo(index, instant?)`,
`canGoToNext()`, `canGoToPrev()`, `selectedSnap()`, `previousSnap()`,
`snapList()`, `snapIndex(offset)`, `scrollProgress()`, `slidesInView()`,
`slidesNotInView()`, `reInit()`, `destroy()`, `rootNode()`, `containerNode()`,
`slideNodes()`, más `play()` / `stop()` del autoplay.

Alias v8: `scrollNext`, `scrollPrev`, `scrollTo`, `canScrollNext`,
`canScrollPrev`, `selectedScrollSnap`, `previousScrollSnap`, `scrollSnapList`.

## Eventos

`update:modelValue`, `select`, `settle`, `scroll`, `reinit`, `destroy`,
`pointerdown`, `pointermove`, `pointerup`, `slidesinview`, `slideschanged`,
`slidefocus`, `autoplay:play`, `autoplay:stop`, `autoplay:interaction`.

## Slots

| Slot | Props | Descripción |
|------|-------|-------------|
| default | - | Slides (KunCarouselSlide o divs) |
| #prev | `{ goToPrev, disabled, canGoToPrev }` | Flecha anterior personalizada |
| #next | `{ goToNext, disabled, canGoToNext }` | Flecha siguiente personalizada |
| #dots | `{ snaps, selectedIndex, goTo }` | Dots personalizados |

## Clicks en slides / grillas

El click que el navegador dispara justo después de un drag se **suprime
automáticamente** en fase de captura en el viewport, antes de llegar a
cards, links o botones del slide. El flag interno se limpia en el próximo
`pointerdown`, por lo que solo se bloquea el click inmediato al drag.

Para lógica propia (sin cablear refs), el contenido puede inyectar el
contexto del carousel con `useKunCarousel()`:

```vue
<script setup>
import { useKunCarousel } from 'adverich-kun-ui'

const carousel = useKunCarousel() // null fuera de un KunCarousel

function onCardClick(item) {
  if (carousel?.didDrag.value) return // venimos de un drag, no fue click
  openDetail(item)
}
</script>

<template>
  <KunCarousel>
    <KunCarouselSlide v-for="item in items" :key="item.id">
      <button type="button" @click="onCardClick(item)">
        {{ item.title }}
      </button>
    </KunCarouselSlide>
  </KunCarousel>
</template>
```

El contexto expone `{ api, didDrag, selectedIndex, isDragging, isSettled }`
(`didDrag` es un `ref` booleano; también está expuesto vía ref del
componente). `KUN_CAROUSEL_KEY` se exporta para casos avanzados.

## Notas

- `loop` es infinito y seamless: clona slides en ambos extremos (con
  `inert` + `aria-hidden`, sin ids duplicados), cruza el borde animando
  hacia el clon y al hacer settle salta de forma invisible al original.
  Requiere al menos 2 slides con scroll; si no, hace fallback a sin loop.
- `duration` sigue la semántica de Embla (fricción) y se mapea a
  milisegundos de transición como `duration × 16`.
- `scrollProgress()` y el evento `scroll` van de 0 (primer snap) a 1
  (último snap), por lo que el 100% siempre es alcanzable.
- En `dragFree` la posición queda libre donde se suelta (con momento);
  el snap seleccionado se actualiza al más cercano para dots y v-model.
- La **posición** siempre descansa en el rango alcanzable `[0, maxScroll]`
  (paridad Embla): nunca hay vacío. `keepSnaps`/`false` conservan todos los
  snaps como seleccionables (dots), pero los que están más allá del borde
  descansan exactamente en el borde. `trimSnaps` recorta los snaps que no
  scrollean, igual que en Embla.
