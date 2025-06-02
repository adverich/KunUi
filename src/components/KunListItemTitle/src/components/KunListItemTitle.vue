<template>
  <span
    :class="[
      'truncate',
      fontSize, textColor, fontWeight
    ]"
    v-bind="$attrs"
  >
    <slot>{{ title }}</slot>
  </span>
</template>

<script setup>
const props = defineProps({
  title: {
    type: [String, Number],
    default: null
  },
  textColor: {
    type: String,
    default: 'text-gray-500 dark:text-gray-400'
  },
  fontSize: {
    type: String,
    default: 'text-lg'
  },
  fontWeight: {
    type: String,
    default: 'font-medium'
  }
})
</script>