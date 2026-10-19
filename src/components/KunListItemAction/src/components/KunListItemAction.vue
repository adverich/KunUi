<template>
  <span
    :class="[
      'text-default',
      fontSize,
      fontWeight
    ]"
    v-bind="$attrs"
  >
    <slot>{{ text }}</slot>
  </span>
</template>

<script setup lang="ts">
import { kunListItemActionProps } from '../composables/kunListItemActionProps.js'

const props = defineProps(kunListItemActionProps)
</script>
