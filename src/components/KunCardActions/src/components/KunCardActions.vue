<template>
  <div class="w-full flex" :class="computedClass" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { kunCardActionsProps } from '../composables/kunCardActionsProps'

const props = defineProps(kunCardActionsProps)

const computedClass = computed(() => [
  props.wrap ? 'flex-wrap' : 'flex-nowrap',
  props.justify,
  props.align,
  props.gap,
  props.dense ? 'py-1 px-2' : 'py-3 px-4'
].filter(Boolean))
</script>
