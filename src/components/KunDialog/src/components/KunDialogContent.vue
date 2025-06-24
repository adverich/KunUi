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
  width: String,
  maxWidth: String,
  height: String,
  maxHeight: String,
})

const baseClass = computed(() => {
  if (props.fullscreen) {
    return 'fixed inset-0 w-screen h-screen rounded-none overflow-y-auto shadow-none';
  }

  const overflowClass = props.scrollable ? 'overflow-y-auto' : 'overflow-visible';
  return `relative rounded-xl shadow-xl transition-all ${overflowClass}`;
});

const mergedClass = computed(() => [
  baseClass.value,
  props.contentClass,
  props.bgColor,
  props.width,
  props.maxWidth,
  props.height,
  props.maxHeight
])
</script>
