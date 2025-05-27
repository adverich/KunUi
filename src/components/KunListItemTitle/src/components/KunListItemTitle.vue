<template>
  <span
    :class="[
      'truncate',
      props.fontSize,
      props.fontWeight,
      props.class
    ]"
  >
    <slot>{{ props.title }}</slot>
  </span>
</template>

<script setup>
const props = defineProps({
  title: {
    type: [String, Number],
    default: null
  },
  fontSize: {
    type: String,
    default: 'text-lg'
  },
  fontWeight: {
    type: String,
    default: 'font-medium'
  },
  class: {
    type: [String, Object, Array],
    default: 'font-semibold uppercase'
  }
})
</script>