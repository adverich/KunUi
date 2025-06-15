<template>
  <div
    :class="mergedClass"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
    contentClass: String,
    bgColor: String,
    width: String,
    maxWidth: String,
    height: String,
    maxHeight: String,
})

const baseClass = 'relative rounded-2xl shadow-xl transition-all p-2 overflow-y-auto';
const mergedClass = [baseClass, props.contentClass, props.bgColor, props.width, props.maxWidth, props.height, props.maxHeight]
</script>
