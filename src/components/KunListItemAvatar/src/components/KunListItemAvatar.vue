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
import { computed, useAttrs } from 'vue'
import { kunListItemAvatarProps } from '../composables/kunListItemAvatarProps.js'
import { resolveKunSize, KUN_SQUARE_SIZE, KUN_TEXT_SIZE, hasExplicitDimensionClass } from '../../../../theme/kunSizes.js'

const props = defineProps(kunListItemAvatarProps)
const attrs = useAttrs()

const hasCustomDimension = computed(() => hasExplicitDimensionClass(attrs.class))
const isCircular = computed(() => props.rounded !== 'none')

const sizeClass = computed(() => {
  const size = resolveKunSize(props.size)
  const side = hasCustomDimension.value
    ? (isCircular.value ? 'aspect-square' : '')
    : KUN_SQUARE_SIZE[size]
  return [side, KUN_TEXT_SIZE[size]].filter(Boolean).join(' ')
})
</script>

<style scoped>
.kun-list-item-avatar {
  @apply inline-flex items-center justify-center shrink-0;
}
</style>

