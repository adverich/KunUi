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
import { resolveKunSize, KUN_SQUARE_SIZE, KUN_TEXT_SIZE } from '../../../../theme/kunSizes.js'

const props = defineProps(kunListItemAvatarProps)

const sizeClass = computed(() => {
  const size = resolveKunSize(props.size)
  return `${KUN_SQUARE_SIZE[size]} ${KUN_TEXT_SIZE[size]}`
})
</script>

<style scoped>
.kun-list-item-avatar {
  @apply inline-flex items-center justify-center shrink-0;
}
</style>

