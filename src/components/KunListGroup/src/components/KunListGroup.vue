<template>
  <span
    :class="[
      'kun-list-item-subtitle',
      'text-xs text-gray-500 dark:text-gray-400 truncate',
      props.class
    ]"
  >
    <slot>{{ props.text }}</slot>
  </span>
</template>

<script setup>
const props = defineProps({
  text: {
    type: [String, Number],
    default: null
  },
  class: {
    type: [String, Object, Array],
    default: null
  }
})
</script>