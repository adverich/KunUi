<template>
  <div class="flex items-center min-w-0 truncate" :class="[textSize, fontWeight]">
    <img v-if="titleImage" :src="titleImage" alt="Logo" class="h-6 object-contain" />
    <span v-else>{{ title }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  titleImage: String,
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
