<template>
  <component
    :is="componentTag"
    v-bind="componentAttrs"
    :class="containerClass"
    :style="attrs.style"
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
      <slot v-if="$slots.default">
        {{ label || text }}
      </slot>
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
        <KunIcon icon="$mdi-close" />
      </slot>
    </button>
  </component>
</template>

<script setup>
import { defineEmits, useAttrs, computed } from 'vue'
import { kunChipProps } from '../composables/kunChipProps'
import { useChip } from '../composables/useChip'
import KunIcon from '../../../KunIcon/src/components/KunIcon.vue'

const props = defineProps(kunChipProps)
const emit = defineEmits(['update:modelValue', 'click:close'])
const attrs = useAttrs()

const {
  componentTag,
  componentAttrs,
  computedClass,
  isLink,
  handleClose
} = useChip(props, emit, attrs)

const containerClass = computed(() => [
  'kun-chip',
  ...computedClass.value,
  attrs.class
].filter(Boolean))
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
