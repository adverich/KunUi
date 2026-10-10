<template>
  <li
    :class="[
      'kun-list-subheader',
      'px-4 py-2 uppercase tracking-wider',
      fontSize, textColor, fontWeight
    ]"
    v-bind="$attrs"
    role="separator"
  >
    {{ text }}
    <slot />
  </li>
</template>

<script setup lang="ts">
import { kunListSubheaderProps } from '../composables/kunListSubheaderProps.js'

const props = defineProps(kunListSubheaderProps)
</script>
