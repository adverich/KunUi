<template>
  <ul
    role="list"
    :class="[
      'kun-list',
      {
        'space-y-1': !dense,
        'space-y-0.5': dense,
        'pl-4 border-l-2 border-gray-200 dark:border-gray-700': sub,
        'bg-gray-100 dark:bg-gray-800 p-2 rounded-md': nav,
      },
    ]"
  >
    <slot />
  </ul>
</template>

<script setup>
import { useKunList } from '../composables/useKunList'

const props = defineProps({
  nav: Boolean,
  sub: Boolean,
  dense: Boolean,
  selectable: {
    type: [Boolean, String],
    default: false,
    validator: value => ['single', 'multiple', true, false].includes(value)
  },
  selectedClass: {
    type: String,
    default: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
  }
})

useKunList(props)
</script>