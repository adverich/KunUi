<script setup lang="ts">
import { ref } from 'vue'
import KunCarousel from '../../src/components/KunCarousel.vue'
import KunCarouselSlide from '../../../KunCarouselSlide/src/components/KunCarouselSlide.vue'

const slides = ref([
  { id: 1, title: 'Uno', bg: 'bg-error' },
  { id: 2, title: 'Dos', bg: 'bg-info' },
  { id: 3, title: 'Tres', bg: 'bg-success' },
  { id: 4, title: 'Cuatro', bg: 'bg-warning' },
  { id: 5, title: 'Cinco', bg: 'bg-secondary' },
])
</script>

<template>
  <KunCarousel drag-free align="start" slide-size="65%">
    <KunCarouselSlide v-for="s in slides" :key="s.id">
      <div :class="['flex h-48 items-center justify-center rounded-lg text-2xl font-bold text-highlighted', s.bg]">
        {{ s.title }}
      </div>
    </KunCarouselSlide>
  </KunCarousel>
</template>
