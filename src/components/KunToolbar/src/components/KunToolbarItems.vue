<template>
  <div
    class="inline-flex gap-2 items-center"
    :class="[colorClass, variantClass]"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { kunToolbarItemsProps } from '../composables/kunToolbarItemsProps.js'

const props = defineProps(kunToolbarItemsProps)

const colorClass = computed(() =>
  props.color ? `bg-${props.color}` : ''
)

const variantClass = computed(() => {
  switch (props.variant) {
    case 'flat':
      return 'bg-transparent shadow-none'
    case 'text':
      return 'bg-transparent'
    case 'elevated':
      return 'shadow-md'
    case 'tonal':
      return 'bg-muted text-default'
    case 'outlined':
      return 'ring ring-accented'
    case 'plain':
      return ''
    default:
      return ''
  }
})
</script>

