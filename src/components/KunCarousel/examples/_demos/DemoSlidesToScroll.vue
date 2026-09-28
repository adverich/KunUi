<script setup>
import { ref } from 'vue'
import KunCarousel from '../../src/components/KunCarousel.vue'
import KunCarouselSlide from '../../../KunCarouselSlide/src/components/KunCarouselSlide.vue'

const slides = ref(Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
  bg: ['bg-red-500', 'bg-blue-500', 'bg-green-500'][i % 3],
})))
</script>

<template>
  <KunCarousel align="start" slide-size="33.3333%" :slides-to-scroll="3" gap="0.75rem">
    <KunCarouselSlide v-for="s in slides" :key="s.id">
      <div :class="['flex h-40 items-center justify-center rounded-xl text-xl font-bold text-white', s.bg]">
        {{ s.title }}
      </div>
    </KunCarouselSlide>
  </KunCarousel>
</template>
