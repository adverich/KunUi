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

<script setup lang="ts">
import { kunListItemTextProps } from '../composables/kunListItemTextProps.js'

const props = defineProps(kunListItemTextProps)
</script>
