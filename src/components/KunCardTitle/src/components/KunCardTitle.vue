<!-- KunCardTitle.vue -->
<template>
  <div :class="containerClass" :style="finalStyle">
    <!-- Prepend slot or icon -->
    <div v-if="$slots.prepend || prepend" class="kun-card-title__prepend">
      <slot name="prepend">
        <KunIcon v-if="prepend" :icon="prepend" />
      </slot>
    </div>

    <!-- Title and optional subtitle -->
    <div class="kun-card-title__content">
      <h3 :class="titleClass">
        <slot>{{ title }}</slot>
      </h3>

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
import { computed, useAttrs } from 'vue'
import { kunCardTitleProps } from '../composables/kunCardTitleProps'
import KunIcon from '../../../KunIcon/src/components/KunIcon.vue'

const attrs = useAttrs()
const props = defineProps(kunCardTitleProps)

const containerClass = computed(() => [
  'kun-card-title',
  props.dense ? 'py-1 px-2 text-sm' : 'py-3 px-4 text-base',
  props.flat ? 'shadow-none' : 'shadow',
  props.rounded === true ? 'rounded-md' : props.rounded ? `rounded-${props.rounded}` : '',
  props.bgColor,
  props.textColor,
  attrs.class // External class
].filter(Boolean))

const finalStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  ...attrs.style // External style
}))

const titleClass = computed(() => props.dense ? 'font-medium' : 'font-semibold')
const subtitleClass = computed(() => 'text-xs opacity-75 mt-1')
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
  @apply flex flex-col flex-grow truncate;
}
</style>
