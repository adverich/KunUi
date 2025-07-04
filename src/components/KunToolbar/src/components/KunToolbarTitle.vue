<template>
  <component :is="tag" class="text-xl font-medium whitespace-nowrap">
    <slot name="text">
      {{ text }}
    </slot>
  </component>
</template>

<script setup>
const props = defineProps({
  tag: {
    type: String,
    default: 'div',
  },
  text: {
    type: String,
    default: '',
  },
})
</script>
