<script setup lang="ts">
import { ref } from 'vue'
import KunCarousel from '../../src/components/KunCarousel.vue'
import KunCarouselSlide from '../../../KunCarouselSlide/src/components/KunCarouselSlide.vue'

const slides = ref([
  { id: 1, title: 'Slide 1', bg: 'bg-red-500' },
  { id: 2, title: 'Slide 2', bg: 'bg-blue-500' },
  { id: 3, title: 'Slide 3', bg: 'bg-green-500' },
  { id: 4, title: 'Slide 4', bg: 'bg-amber-500' },
  { id: 5, title: 'Slide 5', bg: 'bg-purple-500' },
])

const selected = ref(0)
</script>

<template>
  <KunCarousel v-model="selected" align="center">
    <KunCarouselSlide v-for="s in slides" :key="s.id">
      <div :class="['flex h-56 items-center justify-center rounded-xl text-2xl font-bold text-white', s.bg]">
        {{ s.title }}
      </div>
    </KunCarouselSlide>
  </KunCarousel>
</template>
