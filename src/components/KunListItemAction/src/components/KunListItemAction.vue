<template>
  <span
    :class="[
      textColor,
      fontSize,
      fontWeight
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
    default: 'text-black dark:text-white',
  },
  fontSize:{
    type: String,
    default: 'text-sm'
  },
  fontWeight:{
    type: String,
    default: 'font-medium'
  },
})
</script>