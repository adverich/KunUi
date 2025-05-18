<template>
  <span
    :class="[
      'kun-list-item-text',
      'text-sm font-medium text-gray-900 dark:text-gray-100 truncate',
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