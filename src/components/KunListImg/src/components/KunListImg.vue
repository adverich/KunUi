<template>
  <div
    :class="[
      'kun-list-img',
      'overflow-hidden rounded-md',
      bgColor,
    ]"
    v-bind="$attrs"
  >
    <img
      :src="props.src"
      :alt="props.alt"
      class="w-full h-full object-cover"
    />
  </div>
</template>

<script setup>
import { kunListImgProps } from '../composables/kunListImgProps'

const props = defineProps(kunListImgProps)
</script>