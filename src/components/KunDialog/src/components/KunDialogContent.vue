<template>
  <div :class="mergedClass">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { kunDialogContentProps } from '../composables/kunDialogContentProps'

const props = defineProps(kunDialogContentProps)

const baseClass = computed(() => {
  if (props.fullscreen) {
    const overflowClass = props.scrollable ? 'overflow-y-auto' : 'overflow-visible';  
    return `fixed inset-0 w-screen h-screen rounded-none shadow-none overflow-visible ${overflowClass}`;
  }

  const overflowClass = props.scrollable ? 'overflow-y-auto' : 'overflow-visible';
  return `relative rounded-xl shadow-xl transition-all ${overflowClass}`;
});

const mergedClass = computed(() => [
  baseClass.value,
  props.contentClass,
  props.bgColor,
  props.minWidth,
  props.width,
  props.maxWidth,
  props.height,
  props.maxHeight
])
</script>
