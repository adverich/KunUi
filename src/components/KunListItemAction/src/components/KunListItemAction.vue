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

<script setup>
import { kunListItemActionProps } from '../composables/kunListItemActionProps'

const props = defineProps(kunListItemActionProps)
</script>