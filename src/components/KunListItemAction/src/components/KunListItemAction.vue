<template>
  <span
    :class="[
      textColor,
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
