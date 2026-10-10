<script setup lang="ts">
import { ref } from 'vue'
import KunCarousel from '../../src/components/KunCarousel.vue'
import KunCarouselSlide from '../../../KunCarouselSlide/src/components/KunCarouselSlide.vue'

const progress = ref(0)

const slides = ref([
  { id: 1, title: '1', bg: 'bg-red-500' },
  { id: 2, title: '2', bg: 'bg-blue-500' },
  { id: 3, title: '3', bg: 'bg-green-500' },
  { id: 4, title: '4', bg: 'bg-amber-500' },
])
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center gap-3">
      <div class="h-2 flex-1 overflow-hidden rounded-full bg-surface-light">
        <div
          class="h-full rounded-full bg-primary transition-[width]"
          :style="{ width: `${Math.round(progress * 100)}%` }"
        />
      </div>
      <span class="w-12 text-right text-sm tabular-nums opacity-70">{{ Math.round(progress * 100) }}%</span>
    </div>
    <KunCarousel align="start" @scroll="(p) => (progress = p)">
      <KunCarouselSlide v-for="s in slides" :key="s.id">
        <div :class="['flex h-56 items-center justify-center rounded-xl text-2xl font-bold text-white', s.bg]">
          {{ s.title }}
        </div>
      </KunCarouselSlide>
    </KunCarousel>
  </div>
</template>
