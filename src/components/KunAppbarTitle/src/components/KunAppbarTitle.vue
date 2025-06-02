<template>
  <div class="flex items-center min-w-0 truncate" :class="[textSize, fontWeight]" v-bind="$attrs">
    <img v-if="titleImage" :src="titleImage" alt="Logo" class="object-contain" :class="titleImageSize" />
    <span v-else>{{ title }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  titleImage: String,
  titleImageSize: {
    type: String,
    default: 'h-6'
  },
  textSize: {
    type: String,
    default: 'text-base'
  },
  fontWeight: {
    type: String,
    default: 'font-medium'
  }
})
</script>
