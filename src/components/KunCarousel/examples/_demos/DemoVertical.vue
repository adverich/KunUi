<script setup lang="ts">
import { ref } from 'vue'
import KunCarousel from '../../src/components/KunCarousel.vue'
import KunCarouselSlide from '../../../KunCarouselSlide/src/components/KunCarouselSlide.vue'

const slides = ref([
  { id: 1, title: 'A', bg: 'bg-error' },
  { id: 2, title: 'B', bg: 'bg-info' },
  { id: 3, title: 'C', bg: 'bg-success' },
  { id: 4, title: 'D', bg: 'bg-warning' },
])
</script>

<template>
  <KunCarousel axis="y" drag-free height="320px" slide-size="45%">
    <KunCarouselSlide v-for="s in slides" :key="s.id">
      <div :class="['flex h-full min-h-32 items-center justify-center rounded-lg text-2xl font-bold text-highlighted', s.bg]">
        {{ s.title }}
      </div>
    </KunCarouselSlide>
  </KunCarousel>
</template>
