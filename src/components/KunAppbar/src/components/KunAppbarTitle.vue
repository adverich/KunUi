<template>
  <div class="flex items-center min-w-0 truncate" :class="[textSize, fontWeight]">
    {{ title }}
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
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
