<script setup>
import { ref } from 'vue'
import KunCarousel from '../../src/components/KunCarousel.vue'
import KunCarouselSlide from '../../../KunCarouselSlide/src/components/KunCarouselSlide.vue'

const carouselRef = ref(null)

const slides = ref([
  { id: 1, title: 'Promo 1', bg: 'bg-red-500' },
  { id: 2, title: 'Promo 2', bg: 'bg-blue-500' },
  { id: 3, title: 'Promo 3', bg: 'bg-green-500' },
])

function toggle() {
  if (!carouselRef.value) return
  if (carouselRef.value.autoplayPlaying) carouselRef.value.stop()
  else carouselRef.value.play()
}
</script>

<template>
  <div class="space-y-3">
    <KunCarousel
      ref="carouselRef"
      autoplay
      :autoplay-delay="2000"
      loop
      arrows-position="bottom"
    >
      <KunCarouselSlide v-for="s in slides" :key="s.id">
        <div :class="['flex h-56 items-center justify-center rounded-xl text-2xl font-bold text-white', s.bg]">
          {{ s.title }}
        </div>
      </KunCarouselSlide>
    </KunCarousel>
    <button
      type="button"
      class="rounded-lg border border-surface bg-surface-light px-4 py-2 text-sm"
      @click="toggle"
    >
      Play / Stop (API programática)
    </button>
  </div>
</template>
