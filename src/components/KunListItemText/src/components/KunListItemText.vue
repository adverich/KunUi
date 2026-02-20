<template>
  <span
    :class="[
      'truncate',
      fontSize, textColor, fontWeight
    ]"
    v-bind="$attrs"
  >
    <slot>{{ text }}</slot>
  </span>
</template>

<script setup>
import { kunListItemTextProps } from '../composables/kunListItemTextProps'

const props = defineProps(kunListItemTextProps)
</script>