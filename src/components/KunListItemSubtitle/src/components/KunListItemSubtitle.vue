<template>
  <span
    :class="[
      'kun-list-item-subtitle',
      'truncate',
      textColor, fontSize, fontWeight
    ]"
    v-bind="$attrs"
  >
    <slot>{{ text }}</slot>
  </span>
</template>

<script setup>
const props = defineProps({
  text: {
    type: [String, Number],
    default: null
  },
  textColor: {
    type: String,
    default: 'text-gray-500 dark:text-gray-400'
  },
  fontSize: {
    type: String,
    default: 'text-xs'
  },
  fontWeight: {
    type: String,
    default: 'font-medium'
  }
})
</script>