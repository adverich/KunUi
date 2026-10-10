<script setup lang="ts">
import { ref } from 'vue'
import KunCarousel from '../../src/components/KunCarousel.vue'
import KunCarouselSlide from '../../../KunCarouselSlide/src/components/KunCarouselSlide.vue'

const slides = ref([
  { id: 1, title: '70%', bg: 'bg-red-500', size: '70%' },
  { id: 2, title: '40%', bg: 'bg-blue-500', size: '40%' },
  { id: 3, title: '60%', bg: 'bg-green-500', size: '60%' },
  { id: 4, title: '35%', bg: 'bg-amber-500', size: '35%' },
  { id: 5, title: '50%', bg: 'bg-purple-500', size: '50%' },
])
</script>

<template>
  <KunCarousel align="start" :contain-scroll="false">
    <KunCarouselSlide v-for="s in slides" :key="s.id" :size="s.size">
      <div :class="['flex h-48 items-center justify-center rounded-xl text-2xl font-bold text-white', s.bg]">
        {{ s.title }}
      </div>
    </KunCarouselSlide>
  </KunCarousel>
</template>
