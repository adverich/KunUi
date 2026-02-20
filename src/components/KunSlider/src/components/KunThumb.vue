<template>
  <div
    class="absolute z-40 -top-1 w-4 h-4 rounded-full cursor-pointer touch-none"
    :class="[thumbColor]"
    :style="[thumbStyle]"
    role="slider"
    tabindex="0"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-valuenow="value"
    @keydown="onKeydown"
  >
    <div
      v-if="thumbLabel"
      class="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-200/40 dark:bg-gray-800/40 text-black dark:text-white text-xs px-3 py-2 rounded-full whitespace-nowrap select-none"
    >
      {{ value }}
    </div>
  </div>
</template>

<script setup>
import { kunThumbProps } from '../composables/kunThumbProps'

const props = defineProps(kunThumbProps)

const emit = defineEmits(['update'])

function onKeydown(e) {
  let delta = 0
  if (e.key === 'ArrowRight' || e.key === 'ArrowUp') delta = props.step
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') delta = -props.step
  else return

  const newValue = Math.min(props.max, Math.max(props.min, props.value + delta))
  emit('update', newValue)
}
</script>
