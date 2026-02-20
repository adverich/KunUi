<template>
  <span
    :class="[
      'kun-list-item-subtitle',
      'truncate',
      textColor, fontSize, fontWeight
    ]"
    v-bind="$attrs"
  >
    <slot>{{ text }}</slot>
  </span>
</template>

<script setup>
import { kunListItemSubtitleProps } from '../composables/kunListItemSubtitleProps'

const props = defineProps(kunListItemSubtitleProps)
</script>