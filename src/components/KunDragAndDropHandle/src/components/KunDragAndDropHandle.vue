<template>
  <span
    data-kun-dnd-handle
    tabindex="0"
    :aria-label="label"
    :aria-disabled="disabled ? 'true' : 'false'"
    :class="[
      'inline-flex items-center justify-center select-none text-ui-muted px-1',
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

<script setup>
import { computed } from 'vue'
import { kunDragAndDropHandleProps } from '../composables/kunDragAndDropHandleProps'

const props = defineProps(kunDragAndDropHandleProps)

const sizeClass = computed(() => {
  const map = {
    xxs: 'text-[10px] min-h-4 min-w-4',
    xs: 'text-xs min-h-5 min-w-5',
    sm: 'text-sm min-h-6 min-w-6',
    md: 'text-base min-h-8 min-w-8',
    lg: 'text-lg min-h-9 min-w-9',
    xl: 'text-xl min-h-10 min-w-10',
    xxl: 'text-2xl min-h-12 min-w-12',
  }
  return map[props.size] || map.xs
})
</script>
