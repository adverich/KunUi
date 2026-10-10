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
      class="absolute -top-10 left-1/2 -translate-x-1/2 bg-ui-surface-raised text-ui text-xs px-3 py-2 rounded-full whitespace-nowrap select-none"
    >
      {{ value }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { kunThumbProps } from '../composables/kunThumbProps.js'

const props = defineProps(kunThumbProps)

const emit = defineEmits(['update'])

function onKeydown(e: KeyboardEvent): void {
  const step = Number(props.step ?? 1);
  const min = Number(props.min ?? 0);
  const max = Number(props.max ?? 100);
  const current = Number(props.value ?? 0);
  let delta = 0
  if (e.key === 'ArrowRight' || e.key === 'ArrowUp') delta = step
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') delta = -step
  else return

  const newValue = Math.min(max, Math.max(min, current + delta))
  emit('update', newValue)
}
</script>

