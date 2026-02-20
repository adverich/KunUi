<template>
  <component :is="tag" class="text-xl font-medium whitespace-nowrap">
    <slot name="text">
      {{ text }}
    </slot>
  </component>
</template>

<script setup>
import { kunToolbarTitleProps } from '../composables/kunToolbarTitleProps'

const props = defineProps(kunToolbarTitleProps)
</script>
