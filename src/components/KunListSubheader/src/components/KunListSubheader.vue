<template>
  <li
    :class="[
      'kun-list-subheader',
      'px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider',
      props.class
    ]"
    role="separator"
  >
    {{ props.text }}
    <slot />
  </li>
</template>

<script setup>
const props = defineProps({
  text: {
    type: [String, Number],
    default: ''
  },
  class: {
    type: [String, Object, Array],
    default: null
  }
})
</script>