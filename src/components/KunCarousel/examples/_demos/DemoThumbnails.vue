<script setup lang="ts">
import { ref, type Ref } from 'vue'
import KunCarousel from '../../src/components/KunCarousel.vue'
import KunCarouselSlide from '../../../KunCarouselSlide/src/components/KunCarouselSlide.vue'

type CarouselInstance = InstanceType<typeof KunCarousel>;

const mainRef: Ref<CarouselInstance | null> = ref(null)
const thumbsRef: Ref<CarouselInstance | null> = ref(null)
const selected = ref(0)

const slides = ref([
  { id: 1, title: 'Montaña', bg: 'bg-muted' },
  { id: 2, title: 'Océano', bg: 'bg-sky-600' },
  { id: 3, title: 'Bosque', bg: 'bg-emerald-600' },
  { id: 4, title: 'Desierto', bg: 'bg-warning' },
  { id: 5, title: 'Volcán', bg: 'bg-error' },
  { id: 6, title: 'Glaciar', bg: 'bg-cyan-500' },
  { id: 7, title: 'Selva', bg: 'bg-lime-600' },
  { id: 8, title: 'Ciudad', bg: 'bg-secondary' },
])

function goToSlide(i: number): void {
  mainRef.value?.goTo(i)
  thumbsRef.value?.goTo(i)
}

function onMainSelect(_: unknown, i: number): void {
  // la tira de miniaturas acompaña al carousel principal
  thumbsRef.value?.goTo(i)
}
</script>

<template>
  <div class="space-y-3">
    <KunCarousel ref="mainRef" v-model="selected" align="center" :show-dots="false" @select="onMainSelect">
      <KunCarouselSlide v-for="s in slides" :key="s.id">
        <div :class="['flex h-56 items-center justify-center rounded-lg text-2xl font-bold text-inverted', s.bg]">
          {{ s.title }}
        </div>
      </KunCarouselSlide>
    </KunCarousel>

    <KunCarousel
      ref="thumbsRef"
      align="start"
      slide-size="18%"
      gap="0.5rem"
      contain-scroll="keepSnaps"
      drag-free
      :show-arrows="false"
      :show-dots="false"
    >
      <KunCarouselSlide v-for="(s, i) in slides" :key="s.id">
        <button
          type="button"
          :class="[
            'flex h-16 w-full cursor-pointer items-center justify-center rounded-lg text-sm font-bold text-inverted transition',
            s.bg,
            i !== selected ? 'opacity-50 hover:opacity-90' : '',
          ]"
          :style="i === selected ? { outline: '3px solid #ffffff', outlineOffset: '2px' } : {}"
          @click="goToSlide(i)"
        >
          {{ i + 1 }}
        </button>
      </KunCarouselSlide>
    </KunCarousel>
  </div>
</template>
