<script setup>
import { ref } from 'vue'
import KunCarousel from '../../src/components/KunCarousel.vue'
import KunCarouselSlide from '../../../KunCarouselSlide/src/components/KunCarouselSlide.vue'

const slides = ref([
  { id: 1, title: 'Uno', bg: 'bg-red-500' },
  { id: 2, title: 'Dos', bg: 'bg-blue-500' },
  { id: 3, title: 'Tres', bg: 'bg-green-500' },
  { id: 4, title: 'Cuatro', bg: 'bg-amber-500' },
  { id: 5, title: 'Cinco', bg: 'bg-purple-500' },
])
</script>

<template>
  <KunCarousel loop align="start" slide-size="70%" :slides-to-scroll="1">
    <KunCarouselSlide v-for="s in slides" :key="s.id">
      <div :class="['flex h-48 items-center justify-center rounded-xl text-2xl font-bold text-white', s.bg]">
        {{ s.title }}
      </div>
    </KunCarouselSlide>
  </KunCarousel>
</template>
