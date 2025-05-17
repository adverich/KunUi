<template>
  <div role="separator" :class="[
    'shrink-0',
    vertical ? 'w-px h-full' : 'h-px w-full',
    dashed ? 'border border-dashed border-current bg-transparent' : 'bg-current',
    inset ? (vertical ? 'ml-4' : 'mx-4') : '',
    color,
  ]" :style="lengthStyle" />
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  vertical: Boolean,
  inset: Boolean,
  dashed: Boolean,
  length: [String, Number],
  color: {
    type: String,
    default: ''
  }
})

const lengthStyle = computed(() => {
  const len = props.length != null
    ? typeof props.length === 'number' ? `${props.length}px` : props.length
    : undefined

  return props.vertical
    ? { height: len }
    : { width: len }
})
</script>
