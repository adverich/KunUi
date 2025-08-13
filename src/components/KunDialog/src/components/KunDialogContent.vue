<template>
  <div :class="mergedClass">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  fullscreen: Boolean,
  scrollable: Boolean,
  contentClass: String,
  bgColor: String,
  minWidth: String,
  width: String,
  maxWidth: String,
  height: String,
  maxHeight: String,
})

const baseClass = computed(() => {
  if (props.fullscreen) {
    const overflowClass = props.scrollable ? 'overflow-y-auto' : 'overflow-visible';  
    return `fixed inset-0 w-screen h-dvh rounded-none shadow-none overflow-visible ${overflowClass}`;
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
