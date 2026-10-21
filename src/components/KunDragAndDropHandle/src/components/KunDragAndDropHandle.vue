<template>
  <span
    data-kun-dnd-handle
    tabindex="0"
    :aria-label="label"
    :aria-disabled="disabled ? 'true' : 'false'"
    :class="[
      'inline-flex items-center justify-center select-none text-muted px-1',
      sizeClass,
      disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing',
      wrapperClass,
    ]"
    @click.stop
    @keydown.enter.prevent
    @keydown.space.prevent
  >
    <slot>
      <span aria-hidden="true" class="tracking-tighter leading-none opacity-70 font-bold">⋮⋮</span>
    </slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { kunDragAndDropHandleProps } from '../composables/kunDragAndDropHandleProps.js'
import { resolveKunSize, KUN_SQUARE_SIZE, KUN_TEXT_SIZE } from '../../../../theme/kunSizes.js'

const props = defineProps(kunDragAndDropHandleProps)

const sizeClass = computed(() => {
  const size = resolveKunSize(props.size, 'xs')
  return `${KUN_SQUARE_SIZE[size]} ${KUN_TEXT_SIZE[size]}`
})
</script>

