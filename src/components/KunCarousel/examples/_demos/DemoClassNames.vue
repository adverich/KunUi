<script setup>
import { ref } from 'vue'
import KunCarousel from '../../src/components/KunCarousel.vue'
import KunCarouselSlide from '../../../KunCarouselSlide/src/components/KunCarouselSlide.vue'

const slides = ref([
  { id: 1, title: 'Slide 1', bg: 'bg-red-500' },
  { id: 2, title: 'Slide 2', bg: 'bg-blue-500' },
  { id: 3, title: 'Slide 3', bg: 'bg-green-500' },
])
</script>

<template>
  <KunCarousel :show-arrows="false" :show-dots="false" arrows-position="bottom">
    <KunCarouselSlide v-for="s in slides" :key="s.id">
      <div :class="['flex h-56 items-center justify-center rounded-xl text-2xl font-bold text-white', s.bg]">
        {{ s.title }}
      </div>
    </KunCarouselSlide>

    <template #prev="{ goToPrev, disabled }">
      <button
        type="button"
        :disabled="disabled"
        class="rounded-md bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:opacity-30"
        @click="goToPrev"
      >
        ‹ Anterior
      </button>
    </template>

    <template #next="{ goToNext, disabled }">
      <button
        type="button"
        :disabled="disabled"
        class="rounded-md bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:opacity-30"
        @click="goToNext"
      >
        Siguiente ›
      </button>
    </template>

    <template #dots="{ snaps, selectedIndex, goTo }">
      <div class="flex items-center gap-1.5">
        <button
          v-for="(_, i) in snaps"
          :key="i"
          type="button"
          :class="[
            'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition',
            i === selectedIndex ? 'bg-emerald-600 text-white' : 'bg-surface-light hover:bg-surface',
          ]"
          @click="goTo(i)"
        >
          {{ i + 1 }}
        </button>
      </div>
    </template>
  </KunCarousel>
</template>
