<template>
  <span
    :class="[
      'truncate',
      fontSize, textColor, fontWeight
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
  fontSize: {
    type: String,
    default: 'text-sm'
  },
  textColor: {
    type: String,
    default: 'text-gray-500 dark:text-gray-400'
  },
  fontWeight: {
    type: String,
    default: 'font-medium'
  }
})
</script>