<script setup>
import { ref } from 'vue'
import KunCarousel from '../../src/components/KunCarousel.vue'
import KunCarouselSlide from '../../../KunCarouselSlide/src/components/KunCarouselSlide.vue'

const slides = ref(Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
  bg: ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-amber-500'][i % 4],
})))

// En mobile: 1 por vista. Desde 768px: 2 por avance, alineado al inicio.
const breakpoints = {
  '(min-width: 768px)': { slidesToScroll: 2, align: 'start' },
}
</script>

<template>
  <KunCarousel align="center" slide-size="50%" :slides-to-scroll="1" :breakpoints="breakpoints" gap="0.75rem" :contain-scroll="false">
    <KunCarouselSlide v-for="s in slides" :key="s.id">
      <div :class="['flex h-40 items-center justify-center rounded-xl text-xl font-bold text-white', s.bg]">
        {{ s.title }}
      </div>
    </KunCarouselSlide>
  </KunCarousel>
</template>
