<template>
  <div
    class="kun-list-item-avatar"
    :class="[sizeClass, rounded, bgColor, textColor, fontWeight]"
    v-bind="$attrs"
  >
    <slot>
      <span v-if="text" class="truncate">{{ text }}</span>
    </slot>
  </div>
</template>

<script setup>
import { kunListItemAvatarProps } from '../composables/kunListItemAvatarProps'

const props = defineProps(kunListItemAvatarProps)

const sizeClass = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base'
}[props.size] || 'w-8 h-8 text-sm'
</script>

<style scoped>
.kun-list-item-avatar {
  @apply inline-flex items-center justify-center shrink-0;
}
</style>
