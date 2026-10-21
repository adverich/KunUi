<script setup lang="ts">
import { ref, type Ref } from 'vue'
import KunCarousel from '../../src/components/KunCarousel.vue'
import KunCarouselSlide from '../../../KunCarouselSlide/src/components/KunCarouselSlide.vue'

const carouselRef: Ref<InstanceType<typeof KunCarousel> | null> = ref(null)

const slides = ref([
  { id: 1, title: 'Promo 1', bg: 'bg-error' },
  { id: 2, title: 'Promo 2', bg: 'bg-info' },
  { id: 3, title: 'Promo 3', bg: 'bg-success' },
])

function toggle(): void {
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
        <div :class="['flex h-56 items-center justify-center rounded-lg text-2xl font-bold text-highlighted', s.bg]">
          {{ s.title }}
        </div>
      </KunCarouselSlide>
    </KunCarousel>
    <button
      type="button"
      class="rounded-lg border border-muted bg-muted px-4 py-2 text-sm"
      @click="toggle"
    >
      Play / Stop (API programática)
    </button>
  </div>
</template>
