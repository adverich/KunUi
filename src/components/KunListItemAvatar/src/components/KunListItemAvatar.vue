<template>
  <div
    class="kun-list-item-avatar"
    :class="[sizeClass, rounded === 'none' ? 'rounded-none' : 'rounded-full', 'bg-muted text-default', fontWeight]"
    v-bind="$attrs"
  >
    <slot>
      <span v-if="text" class="truncate">{{ text }}</span>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { kunListItemAvatarProps } from '../composables/kunListItemAvatarProps.js'

const props = defineProps(kunListItemAvatarProps)

const sizeClass = computed(() => ({
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base'
} as Record<string, string>)[props.size] || 'w-8 h-8 text-sm')
</script>

<style scoped>
.kun-list-item-avatar {
  @apply inline-flex items-center justify-center shrink-0;
}
</style>

