<template>
  <component :is="tag" class="text-xl font-medium whitespace-nowrap">
    <slot name="text">
      {{ text }}
    </slot>
  </component>
</template>

<script setup lang="ts">
import { kunToolbarTitleProps } from '../composables/kunToolbarTitleProps.js'

const props = defineProps(kunToolbarTitleProps)
</script>

