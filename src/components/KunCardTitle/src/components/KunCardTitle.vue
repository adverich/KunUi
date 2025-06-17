<!-- KunCardTitle.vue -->
<template>
  <div :class="computedClass" :style="computedStyle" v-bind="$attrs">
    <!-- Prepend slot or icon -->
    <div v-if="$slots.prepend || prepend" class="kun-card-title__prepend">
      <slot name="prepend">
        <KunIcon v-if="prepend" :icon="prepend" />
      </slot>
    </div>

    <!-- Title and optional subtitle -->
    <div class="kun-card-title__content">
      <div :class="titleClass">
        <slot>{{ title }}</slot>
      </div>

      <div v-if="$slots.subtitle || subtitle" :class="subtitleClass">
        <slot name="subtitle">{{ subtitle }}</slot>
      </div>
    </div>

    <!-- Append slot or icon -->
    <div v-if="$slots.append || append" class="kun-card-title__append">
      <slot name="append">
        <KunIcon v-if="append" :icon="append" />
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { kunCardTitleProps } from '../composables/kunCardTitleProps'
import KunIcon from '../../../KunIcon/src/components/KunIcon.vue'

const props = defineProps(kunCardTitleProps)

const computedClass = computed(() => [
  'kun-card-title',
  props.dense ? 'py-1 px-2 text-sm' : 'py-3 px-4 text-base',
  props.flat ? 'shadow-none' : 'shadow',
  props.rounded === true ? 'rounded-md' : props.rounded ? `rounded-${props.rounded}` : '',
  props.bgColor,
  props.textColor
].filter(Boolean))

const computedStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  width: typeof props.width === 'number' ? `${props.width}px` : props.width
}))

const titleClass = [props.dense ? 'font-medium' : 'font-semibold', props.titleSize]
const subtitleClass = 'text-xs opacity-75 mt-1';
</script>

<style scoped>
.kun-card-title {
  @apply flex items-center w-full;
}
.kun-card-title__prepend,
.kun-card-title__append {
  @apply flex items-center justify-center;
}
.kun-card-title__content {
  @apply flex flex-col flex-grow whitespace-normal break-words;
}
</style>
