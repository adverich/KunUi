<script setup>
import { ref } from 'vue'
import KunCarousel from '../../src/components/KunCarousel.vue'
import KunCarouselSlide from '../../../KunCarouselSlide/src/components/KunCarouselSlide.vue'

const mainRef = ref(null)
const thumbsRef = ref(null)
const selected = ref(0)

const slides = ref([
  { id: 1, title: 'Montaña', bg: 'bg-slate-500' },
  { id: 2, title: 'Océano', bg: 'bg-sky-600' },
  { id: 3, title: 'Bosque', bg: 'bg-emerald-600' },
  { id: 4, title: 'Desierto', bg: 'bg-amber-500' },
  { id: 5, title: 'Volcán', bg: 'bg-red-600' },
  { id: 6, title: 'Glaciar', bg: 'bg-cyan-500' },
  { id: 7, title: 'Selva', bg: 'bg-lime-600' },
  { id: 8, title: 'Ciudad', bg: 'bg-purple-600' },
])

function goToSlide(i) {
  mainRef.value?.goTo(i)
  thumbsRef.value?.goTo(i)
}

function onMainSelect(_, i) {
  // la tira de miniaturas acompaña al carousel principal
  thumbsRef.value?.goTo(i)
}
</script>

<template>
  <div class="space-y-3">
    <KunCarousel ref="mainRef" v-model="selected" align="center" :show-dots="false" @select="onMainSelect">
      <KunCarouselSlide v-for="s in slides" :key="s.id">
        <div :class="['flex h-56 items-center justify-center rounded-xl text-2xl font-bold text-white', s.bg]">
          {{ s.title }}
        </div>
      </KunCarouselSlide>
    </KunCarousel>

    <KunCarousel
      ref="thumbsRef"
      align="start"
      slide-size="18%"
      gap="0.5rem"
      contain-scroll="keepSnaps"
      drag-free
      :show-arrows="false"
      :show-dots="false"
    >
      <KunCarouselSlide v-for="(s, i) in slides" :key="s.id">
        <button
          type="button"
          :class="[
            'flex h-16 w-full cursor-pointer items-center justify-center rounded-lg text-sm font-bold text-white transition',
            s.bg,
            i !== selected ? 'opacity-50 hover:opacity-90' : '',
          ]"
          :style="i === selected ? { outline: '3px solid #ffffff', outlineOffset: '2px' } : {}"
          @click="goToSlide(i)"
        >
          {{ i + 1 }}
        </button>
      </KunCarouselSlide>
    </KunCarousel>
  </div>
</template>
