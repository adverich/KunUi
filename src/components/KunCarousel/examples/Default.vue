<script setup lang="ts">
import DemoSection from './_demos/DemoSection.vue'
import DemoDefault from './_demos/DemoDefault.vue'
import DemoLoop from './_demos/DemoLoop.vue'
import DemoRtl from './_demos/DemoRtl.vue'
import DemoSlidesToScroll from './_demos/DemoSlidesToScroll.vue'
import DemoDragFree from './_demos/DemoDragFree.vue'
import DemoAlign from './_demos/DemoAlign.vue'
import DemoVariableWidths from './_demos/DemoVariableWidths.vue'
import DemoVertical from './_demos/DemoVertical.vue'
import DemoSlidesPerView from './_demos/DemoSlidesPerView.vue'
import DemoThumbnails from './_demos/DemoThumbnails.vue'
import DemoHoverSplit from './_demos/DemoHoverSplit.vue'
import DemoBreakpoints from './_demos/DemoBreakpoints.vue'
import DemoAutoplay from './_demos/DemoAutoplay.vue'
import DemoClassNames from './_demos/DemoClassNames.vue'
import DemoProgress from './_demos/DemoProgress.vue'
import DemoLazyLoad from './_demos/DemoLazyLoad.vue'

const groups = [
  {
    title: 'Ejemplos básicos',
    links: [
      { id: 'demo-default', label: 'Default' },
      { id: 'demo-loop', label: 'Loop' },
      { id: 'demo-rtl', label: 'Right To Left' },
      { id: 'demo-slides-to-scroll', label: 'Slides To Scroll' },
      { id: 'demo-drag-free', label: 'Drag Free' },
      { id: 'demo-align', label: 'Align' },
      { id: 'demo-variable-widths', label: 'Variable Widths' },
      { id: 'demo-y-axis', label: 'Y Axis' },
      { id: 'demo-slides-per-view', label: 'Slides Per View' },
      { id: 'demo-thumbnails', label: 'Thumbnails' },
      { id: 'demo-hover-split', label: 'Hover Split' },
      { id: 'demo-responsive', label: 'Responsive' },
    ],
  },
  {
    title: 'Plugins',
    links: [{ id: 'demo-autoplay', label: 'Autoplay' }],
  },
  {
    title: 'API y personalización',
    links: [
      { id: 'demo-class-names', label: 'Flechas y dots' },
      { id: 'demo-progress', label: 'Progress' },
      { id: 'demo-lazy-load', label: 'Lazy Load' },
    ],
  },
]

const codeDefault = `<KunCarousel v-model="selected" align="center">
  <KunCarouselSlide v-for="s in slides" :key="s.id">
    <img :src="s.src" class="h-56 w-full object-cover" />
  </KunCarouselSlide>
</KunCarousel>`

const codeLoop = `<KunCarousel loop align="start" slide-size="70%">
  <KunCarouselSlide v-for="s in slides" :key="s.id">
    ...
  </KunCarouselSlide>
</KunCarousel>`

const codeRtl = `<KunCarousel direction="rtl" align="center">
  ...
</KunCarousel>`

const codeSlidesToScroll = `<KunCarousel align="start" slide-size="33.3333%" :slides-to-scroll="3">
  ...
</KunCarousel>  <!-- 9 slides → 3 grupos de 3 -->`

const codeDragFree = `<KunCarousel drag-free align="start" slide-size="65%">
  ...
</KunCarousel>`

const codeAlign = `<script setup lang="ts">
const align = ref('center') // 'start' | 'center' | 'end'
<\/script>

<KunCarousel :align="align" slide-size="70%" :contain-scroll="false">
  ...
</KunCarousel>  <!-- contain-scroll=false permite centrar los extremos -->`

const codeVariableWidths = `<KunCarousel align="start" :contain-scroll="false">
  <KunCarouselSlide size="70%">...</KunCarouselSlide>
  <KunCarouselSlide size="40%">...</KunCarouselSlide>
  <KunCarouselSlide size="60%">...</KunCarouselSlide>
</KunCarousel>  <!-- contain-scroll=false: el último también es navegable -->`

const codeVertical = `<KunCarousel axis="y" drag-free height="320px" slide-size="45%">
  ...
</KunCarousel>`

const codeSlidesPerView = `<KunCarousel align="start" slide-size="25%" slides-to-scroll="auto">
  ...
</KunCarousel>  <!-- 8 slides → 2 grupos de 4 (una vista por avance) -->`

const codeThumbnails = `<script setup lang="ts">
const mainRef = ref(null)
const thumbsRef = ref(null)
const selected = ref(0)

function goToSlide(i) {
  mainRef.value?.goTo(i)
  thumbsRef.value?.goTo(i)
}
<\/script>

<KunCarousel
  ref="mainRef"
  v-model="selected"
  :show-dots="false"
  @select="(_, i) => thumbsRef.value?.goTo(i)"
>
  ...
</KunCarousel>

<KunCarousel
  ref="thumbsRef"
  align="start"
  slide-size="18%"
  :show-arrows="false"
  :show-dots="false"
>
  <KunCarousel
  ref="thumbsRef"
  align="start"
  slide-size="18%"
  contain-scroll="keepSnaps"
  drag-free
  :show-arrows="false"
  :show-dots="false"
>
  <KunCarouselSlide v-for="(s, i) in slides" :key="s.id">
    <button
      :style="i === selected ? { outline: '3px solid #fff', outlineOffset: '2px' } : {}"
      @click="goToSlide(i)"
    >
      {{ i + 1 }}
    </button>
  </KunCarouselSlide>
</KunCarousel>`

const codeHoverSplit = `<script setup lang="ts">
const selected = ref(0)
const steps = ref([/* { label, product, media… } */])

function goTo(i) {
  selected.value = i
}
<\/script>

<div class="grid md:grid-cols-2">
  <div>
    <h2>Static title stays put</h2>
    <KunCarousel v-model="selected" :draggable="false" :show-arrows="false" :show-dots="false" :duration="35">
      <KunCarouselSlide v-for="s in steps" :key="s.id">…product…</KunCarouselSlide>
    </KunCarousel>
    <button
      v-for="(s, i) in steps"
      :key="s.id"
      @mouseenter="goTo(i)"
      @focus="goTo(i)"
      @click="goTo(i)"
    >{{ i + 1 }}</button>
  </div>
  <KunCarousel v-model="selected" :draggable="false" :show-arrows="false" :show-dots="false" :duration="35">
    <KunCarouselSlide v-for="s in steps" :key="s.id">…media…</KunCarouselSlide>
  </KunCarousel>
</div>`

const codeBreakpoints = `<KunCarousel
  align="center"
  slide-size="50%"
  :slides-to-scroll="1"
  :breakpoints="{ '(min-width: 768px)': { slidesToScroll: 2, align: 'start' } }"
  :contain-scroll="false"
>
  ...
</KunCarousel>`

const codeAutoplay = `<KunCarousel
  ref="carouselRef"
  autoplay
  :autoplay-delay="2000"
  loop
  arrows-position="bottom"
>
  ...
</KunCarousel>

// API programática
carouselRef.value.play()
carouselRef.value.stop()`

const codeClassNames = `<KunCarousel :show-arrows="false" :show-dots="false" arrows-position="bottom">
  ...

  <template #prev="{ goToPrev, disabled }">
    <button :disabled="disabled" @click="goToPrev">‹ Anterior</button>
  </template>
  <template #next="{ goToNext, disabled }">
    <button :disabled="disabled" @click="goToNext">Siguiente ›</button>
  </template>
  <template #dots="{ snaps, selectedIndex, goTo }">
    <button
      v-for="(_, i) in snaps"
      :key="i"
      :class="{ active: i === selectedIndex }"
      @click="goTo(i)"
    >{{ i + 1 }}</button>
  </template>
</KunCarousel>`

const codeProgress = `<script setup lang="ts">
const progress = ref(0)
<\/script>

<div class="progress-bar" :style="{ width: progress * 100 + '%' }" />

<KunCarousel align="start" @scroll="(p) => (progress = p)">
  ... <!-- slides al 100%: el último snap coincide con el final -->
</KunCarousel>`

const codeLazyLoad = `<script setup lang="ts">
const visible = ref([])
<\/script>

<KunCarousel
  align="start"
  slide-size="60%"
  @slidesinview="(_, idxs) => (visible = idxs)"
>
  <KunCarouselSlide v-for="(s, i) in slides" :key="s.id">
    <div v-if="visible.includes(i)">{{ s.title }}</div>
    <div v-else class="skeleton">Cargando…</div>
  </KunCarouselSlide>
</KunCarousel>`
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
    <header class="space-y-1">
      <h2 class="text-xl font-semibold">KunCarousel · Examples</h2>
      <p class="text-sm opacity-70">
        Todos los ejemplos de uso en una sola página, como los
        <span class="italic">predefined examples</span> de Embla Carousel.
      </p>
    </header>

    <nav class="sticky top-0 z-20 -mx-4 space-y-2 bg-surface-dark/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
      <div v-for="group in groups" :key="group.title" class="flex flex-wrap items-center gap-1.5">
        <span class="mr-1 text-[11px] font-semibold uppercase tracking-wide opacity-50">{{ group.title }}:</span>
        <a
          v-for="link in group.links"
          :key="link.id"
          :href="`#${link.id}`"
          class="rounded-md border border-surface bg-surface-light px-2.5 py-1 text-xs transition hover:bg-surface"
        >
          {{ link.label }}
        </a>
      </div>
    </nav>

    <h3 class="pt-2 text-sm font-semibold uppercase tracking-wide opacity-60">Ejemplos básicos</h3>

    <DemoSection id="demo-default" title="Default" description="Setup mínimo: alineación centrada, flechas laterales y dots." :code="codeDefault">
      <DemoDefault />
    </DemoSection>

    <DemoSection id="demo-loop" title="Loop" description="Loop infinito y seamless: al cruzar el borde se anima hacia un clon y el settle salta invisible al original." :code="codeLoop">
      <DemoLoop />
    </DemoSection>

    <DemoSection id="demo-rtl" title="Right To Left" description='direction="rtl": el orden y las flechas se invierten.' :code="codeRtl">
      <DemoRtl />
    </DemoSection>

    <DemoSection id="demo-slides-to-scroll" title="Slides To Scroll" description="Agrupa slides de a N fijo: 9 items → 3 avances de 3." :code="codeSlidesToScroll">
      <DemoSlidesToScroll />
    </DemoSection>

    <DemoSection id="demo-drag-free" title="Drag Free" description="Scroll libre con momento, sin snaps estrictos." :code="codeDragFree">
      <DemoDragFree />
    </DemoSection>

    <DemoSection id="demo-align" title="Align" description="Con slides más chicos que el viewport se ve el efecto peek (asoman los vecinos). containScroll=false permite centrar también los extremos." :code="codeAlign">
      <DemoAlign />
    </DemoSection>

    <DemoSection id="demo-variable-widths" title="Variable Widths" description="Cada slide define su propio tamaño con la prop size. El último slide descansa en el borde, completo y sin vacío." :code="codeVariableWidths">
      <DemoVariableWidths />
    </DemoSection>

    <DemoSection id="demo-y-axis" title="Y Axis" description='axis="y" con drag libre y altura fija del viewport.' :code="codeVertical">
      <DemoVertical />
    </DemoSection>

    <DemoSection id="demo-slides-per-view" title="Slides Per View" description='Avanza de a una vista completa: 8 items de 25% → 2 avances de 4 (a diferencia de Slides To Scroll, que agrupa de a N fijo).' :code="codeSlidesPerView">
      <DemoSlidesPerView />
    </DemoSection>

    <DemoSection id="demo-thumbnails" title="Thumbnails" description="Tira de miniaturas con scroll libre (dragFree + keepSnaps: cada thumb es seleccionable y la tira descansa en el borde sin vacío), sincronizada en ambas direcciones vía API." :code="codeThumbnails">
      <DemoThumbnails />
    </DemoSection>

    <DemoSection id="demo-hover-split" title="Hover Split" description="Dos tracks sincronizados con el mismo v-model: título fijo, swatch y media se deslizan según el sentido del índice. Navegación por hover (y focus/click) sobre números 01–N." :code="codeHoverSplit">
      <DemoHoverSplit />
    </DemoSection>

    <DemoSection id="demo-responsive" title="Responsive Breakpoints" description="Overrides por media query: en desktop avanza de a 2 slides. containScroll=false muestra los extremos completos." :code="codeBreakpoints">
      <DemoBreakpoints />
    </DemoSection>

    <h3 class="pt-2 text-sm font-semibold uppercase tracking-wide opacity-60">Plugins</h3>

    <DemoSection id="demo-autoplay" title="Autoplay" description="Autoplay integrado (equivale al plugin de Embla). Cualquier interacción lo detiene." :code="codeAutoplay">
      <DemoAutoplay />
    </DemoSection>

    <h3 class="pt-2 text-sm font-semibold uppercase tracking-wide opacity-60">API y personalización</h3>

    <DemoSection id="demo-class-names" title="Flechas y dots personalizados" description="Slots #prev, #next y #dots con estilos y contenido propios." :code="codeClassNames">
      <DemoClassNames />
    </DemoSection>

    <DemoSection id="demo-progress" title="Progress" description="Barra de progreso alimentada por el evento scroll (0 - 1)." :code="codeProgress">
      <DemoProgress />
    </DemoSection>

    <DemoSection id="demo-lazy-load" title="Lazy Load" description="El contenido se renderiza cuando el slide entra en vista (evento slidesinview)." :code="codeLazyLoad">
      <DemoLazyLoad />
    </DemoSection>
  </div>
</template>
