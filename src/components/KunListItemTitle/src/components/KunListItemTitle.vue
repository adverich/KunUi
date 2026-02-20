<template>
  <span
    :class="[
      'truncate',
      fontSize, textColor, fontWeight
    ]"
    v-bind="$attrs"
  >
    <slot>{{ title }}</slot>
  </span>
</template>

<script setup>
import { kunListItemTitleProps } from '../composables/kunListItemTitleProps'

const props = defineProps(kunListItemTitleProps)
</script>