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

<script setup>
import { computed } from 'vue'
import { kunCarouselSlideProps } from '../composables/kunCarouselSlideProps'

const props = defineProps(kunCarouselSlideProps)

const slideStyle = computed(() => (props.size ? { flexBasis: props.size } : {}))
</script>

<style>
.kun-carousel__slide {
  flex-shrink: 0;
}
</style>
