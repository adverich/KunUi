<script setup lang="ts">
import { ref, type Ref } from 'vue'
import KunCarousel from '../../src/components/KunCarousel.vue'
import KunCarouselSlide from '../../../KunCarouselSlide/src/components/KunCarouselSlide.vue'

const visible: Ref<number[]> = ref([])

const slides = ref(Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  title: `Contenido ${i + 1}`,
  bg: ['bg-error', 'bg-info', 'bg-success', 'bg-warning', 'bg-secondary', 'bg-primary'][i],
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
        :class="['flex h-48 items-center justify-center rounded-lg text-xl font-bold text-inverted', s.bg]"
      >
        {{ s.title }}
      </div>
      <div v-else class="flex h-48 animate-pulse items-center justify-center rounded-lg bg-muted text-sm opacity-70">
        Cargando…
      </div>
    </KunCarouselSlide>
  </KunCarousel>
</template>
