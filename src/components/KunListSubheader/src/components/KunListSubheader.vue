<template>
  <li
    :class="[
      'kun-list-subheader',
      'px-4 py-2 uppercase tracking-wider',
      fontSize, textColor, fontWeight
    ]"
    v-bind="$attrs"
    role="separator"
  >
    {{ text }}
    <slot />
  </li>
</template>

<script setup>
const props = defineProps({
  text: {
    type: [String, Number],
    default: ''
  },
  fontSize: {
    type: String,
    default: 'text-xs'
  },
  textColor: {
    type: String,
    default: 'text-gray-500 dark:text-gray-400'
  },
  fontWeight: {
    type: String,
    default: 'font-semibold'
  }
})
</script>