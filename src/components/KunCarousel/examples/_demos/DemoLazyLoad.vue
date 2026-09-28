<script setup>
import { ref } from 'vue'
import KunCarousel from '../../src/components/KunCarousel.vue'
import KunCarouselSlide from '../../../KunCarouselSlide/src/components/KunCarouselSlide.vue'

const visible = ref([])

const slides = ref(Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  title: `Contenido ${i + 1}`,
  bg: ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-amber-500', 'bg-purple-500', 'bg-pink-500'][i],
})))
</script>

<template>
  <KunCarousel
    align="start"
    slide-size="60%"
    @slidesinview="(_, idxs) => (visible = idxs)"
  >
    <KunCarouselSlide v-for="(s, i) in slides" :key="s.id">
      <div
        v-if="visible.includes(i)"
        :class="['flex h-48 items-center justify-center rounded-xl text-xl font-bold text-white', s.bg]"
      >
        {{ s.title }}
      </div>
      <div v-else class="flex h-48 animate-pulse items-center justify-center rounded-xl bg-surface-light text-sm opacity-70">
        Cargando…
      </div>
    </KunCarouselSlide>
  </KunCarousel>
</template>
