<template>
  <span
    :class="[
      props.fontSize,
      props.fontWeight,
      props.class,
      'truncate',
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
  fontSize: {
    type: String,
    default: 'text-sm'
  },
  fontWeight: {
    type: String,
    default: 'font-medium'
  },
  class: {
    type: [String, Object, Array],
    default: null
  }
})
</script>