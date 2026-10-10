<template>
  <div role="separator" :class="[
    'shrink-0',
    'flex-grow',
    vertical ? 'w-px h-full' : 'h-px',
    dashed ? 'border border-dashed border-current bg-transparent' : 'bg-current',
    inset ? (vertical ? 'ml-4' : 'mx-4') : '',
    color,
  ]" :style="lengthStyle" v-bind="$attrs"/>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  vertical?: boolean;
  inset?: boolean;
  dashed?: boolean;
  length?: string | number;
  color?: string;
}>()

const lengthStyle = computed(() => {
  const len = props.length != null
    ? typeof props.length === 'number' ? `${props.length}px` : props.length
    : undefined

  return props.vertical
    ? { height: len }
    : { width: len }
})
</script>
