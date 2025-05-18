<template>
  <div
    :class="[
      'kun-list-img',
      'overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700',
      props.class
    ]"
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
  class: {
    type: [String, Object, Array],
    default: null
  }
})
</script>