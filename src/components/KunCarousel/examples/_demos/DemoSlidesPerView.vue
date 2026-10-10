<script setup lang="ts">
import { ref } from 'vue'
import KunCarousel from '../../src/components/KunCarousel.vue'
import KunCarouselSlide from '../../../KunCarouselSlide/src/components/KunCarouselSlide.vue'

const slides = ref(Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
  bg: ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-amber-500'][i % 4],
})))
</script>

<template>
  <KunCarousel align="start" slide-size="25%" slides-to-scroll="auto" gap="0.75rem">
    <KunCarouselSlide v-for="s in slides" :key="s.id">
      <div :class="['flex h-36 items-center justify-center rounded-xl text-lg font-bold text-white', s.bg]">
        {{ s.title }}
      </div>
    </KunCarouselSlide>
  </KunCarousel>
</template>
