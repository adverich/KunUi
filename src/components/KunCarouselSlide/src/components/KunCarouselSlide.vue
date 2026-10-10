<template>
  <div
    data-kun-carousel-slide
    :class="['kun-carousel__slide min-w-0 min-h-0', props.slideClass]"
    :style="slideStyle"
    role="group"
    aria-roledescription="slide"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { kunCarouselSlideProps } from '../composables/kunCarouselSlideProps.js'

const props = defineProps(kunCarouselSlideProps)

const slideStyle = computed(() => (props.size ? { flexBasis: props.size } : {}))
</script>

<style>
.kun-carousel__slide {
  flex-shrink: 0;
}
</style>

