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

<script setup lang="ts">
import { kunListItemTitleProps } from '../composables/kunListItemTitleProps.js'

const props = defineProps(kunListItemTitleProps)
</script>
