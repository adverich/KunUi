<template>
  <div class="w-full flex" :class="computedClass" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { kunCardActionsProps } from '../composables/kunCardActionsProps.js'

const props = defineProps(kunCardActionsProps)

const computedClass = computed(() => [
  props.wrap ? 'flex-wrap' : 'flex-nowrap',
  props.justify,
  props.align,
  props.gap,
  props.dense ? 'py-1 px-2' : 'py-3 px-4'
].filter(Boolean))
</script>

