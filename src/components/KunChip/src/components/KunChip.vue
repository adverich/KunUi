<template>
  <component
    :is="componentTag"
    :class="containerClass"
    v-bind="mergedAttrs"
    :disabled="!isLink && disabled ? true : undefined"
    @click.stop
  >
    <!-- Prepend slot or icon -->
    <div v-if="$slots.prepend || prependIcon" class="kun-chip__prepend mr-1">
      <slot name="prepend">
        <KunIcon v-if="prependIcon" :icon="prependIcon" />
      </slot>
    </div>

    <!-- Content -->
    <div class="kun-chip__content truncate">
      <slot v-if="$slots.default" />
      <template v-else>{{ label || text }}</template>
    </div>

    <!-- Append slot or icon -->
    <div v-if="$slots.append || appendIcon" class="kun-chip__append ml-1">
      <slot name="append">
        <KunIcon v-if="appendIcon" :icon="appendIcon" />
      </slot>
    </div>

    <!-- Close icon -->
    <button
      v-if="closable && modelValue"
      type="button"
      class="kun-chip__close ml-1"
      :aria-label="closeLabel"
      @click.stop.prevent="handleClose"
    >
      <slot name="close">
        <KunIcon icon="$close" />
      </slot>
    </button>
  </component>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { kunChipProps } from '../composables/kunChipProps.js'
import { useChip } from '../composables/useChip.js'
import KunIcon from '../../../KunIcon/src/components/KunIcon.vue'
import { hasExplicitDimensionClass } from '../../../../theme/kunSizes.js'

const props = defineProps(kunChipProps)
const emit = defineEmits(['update:modelValue', 'click:close'])
const attrs = useAttrs()

const {
  componentTag,
  componentAttrs,
  computedClass,
  isLink,
  handleClose
} = useChip(props, emit)

const hasCustomDimension = computed(() => hasExplicitDimensionClass(attrs.class))
const isCircle = computed(() => props.rounded === 'full')

const fontPx = computed(() =>
  props.density === 'compact' ? 12 : props.density === 'comfortable' ? 14 : 14,
)

const contentLength = computed(() => {
  const text = String(props.label ?? props.text ?? '')
  const extras =
    (props.prependIcon ? 1.5 : 0) +
    (props.appendIcon ? 1.5 : 0) +
    (props.closable ? 1.5 : 0)
  return text.length + extras
})

const circleSide = computed(() => {
  const base = props.density === 'compact' ? 20 : props.density === 'comfortable' ? 26 : 30
  return Math.max(base, Math.ceil(contentLength.value * fontPx.value * 0.62 + 8))
})

const circleStyle = computed(() =>
  isCircle.value && !hasCustomDimension.value
    ? { width: `${circleSide.value}px`, height: `${circleSide.value}px` }
    : undefined,
)

const containerClass = computed(() => [
  'kun-chip',
  ...computedClass.value,
  isCircle.value ? 'justify-center overflow-hidden' : '',
  isCircle.value && hasCustomDimension.value ? 'aspect-square' : '',
].filter(Boolean))

const mergedAttrs = computed(() => {
  const merged: Record<string, unknown> = {
    ...attrs,
    ...componentAttrs.value,
  }
  if (circleStyle.value) merged.style = [attrs.style, circleStyle.value]
  return merged
})
</script>

<style scoped>
.kun-chip {
  @apply inline-flex items-center whitespace-nowrap select-none;
}
.kun-chip__prepend,
.kun-chip__append,
.kun-chip__close {
  @apply flex-shrink-0;
}
.kun-chip__content {
  @apply truncate;
}
</style>
