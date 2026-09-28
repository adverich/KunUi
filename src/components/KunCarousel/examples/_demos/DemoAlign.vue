<script setup>
import { ref } from 'vue'
import KunCarousel from '../../src/components/KunCarousel.vue'
import KunCarouselSlide from '../../../KunCarouselSlide/src/components/KunCarouselSlide.vue'

const align = ref('center')

const slides = ref([
  { id: 1, title: 'A', bg: 'bg-red-500' },
  { id: 2, title: 'B', bg: 'bg-blue-500' },
  { id: 3, title: 'C', bg: 'bg-green-500' },
  { id: 4, title: 'D', bg: 'bg-amber-500' },
])
</script>

<template>
  <div class="space-y-3">
    <div class="flex gap-2">
      <button
        v-for="a in ['start', 'center', 'end']"
        :key="a"
        type="button"
        :class="[
          'rounded-lg border px-3 py-1.5 text-sm transition',
          align === a
            ? 'border-primary bg-primary/20 font-semibold'
            : 'border-surface bg-surface-light hover:bg-surface',
        ]"
        @click="align = a"
      >
        {{ a }}
      </button>
    </div>
    <KunCarousel :align="align" slide-size="70%" :contain-scroll="false">
      <KunCarouselSlide v-for="s in slides" :key="s.id">
        <div :class="['flex h-48 items-center justify-center rounded-xl text-2xl font-bold text-white', s.bg]">
          {{ s.title }}
        </div>
      </KunCarouselSlide>
    </KunCarousel>
  </div>
</template>
