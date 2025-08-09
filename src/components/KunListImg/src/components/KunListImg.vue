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
const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  bgColor: {
    type: String,
    default: 'bg-surface'
  }
})
</script>