<template>
  <component :is="props.tag" v-bind="$attrs" :class="computedClasses" @click="$emit('click', $event)"
    @mouseover="$emit('hover', $event)" @contextmenu="$emit('contextmenu', $event)" @focus="$emit('focus', $event)">
    <img v-if="props.image" :src="props.image" :alt="props.alt" :class="computedImageClasses" />
    <span v-else-if="props.icon" :class="computedIconClasses">{{ props.icon }}</span>
    <span v-else-if="props.text" :class="computedTextClasses">{{ props.text }}</span>
    <slot v-if="!props.image && !props.icon && !props.text"></slot>
  </component>
</template>

<script setup>
import { computed, useAttrs } from "vue";
import { kunAvatarProps } from '../composables/kunAvatarProps'

const props = defineProps(kunAvatarProps);
const attrs = useAttrs();

defineEmits(["click", "hover", "contextmenu", "focus"]);

const sizes = {
  "x-small": "w-6 h-6 text-xs",
  small: "w-8 h-8 text-sm",
  default: "w-12 h-12 text-base",
  large: "w-16 h-16 text-lg",
  "x-large": "w-24 h-24 text-xl",
};

const hasBackgroundClass = computed(() => {
  const classes = Array.isArray(attrs.class) ? attrs.class.join(' ') : String(attrs.class || '');
  return /(?:^|\s)(?:bg-|dark:bg-)/.test(classes);
});

const computedClasses = computed(() => [
  "relative flex items-center justify-center overflow-hidden cursor-pointer transition-all",
  sizes[props.size] || sizes.default,
  props.rounded ? "rounded-full" : props.tile ? "rounded-none" : "rounded",
  props.border ? `border border-${props.border}` : "",
  props.color ? `bg-${props.color}` : hasBackgroundClass.value ? "" : "bg-ui-surface-subtle",
  props.density === "compact" ? "p-1" : props.density === "comfortable" ? "p-2" : "p-3",
  props.start ? "ms-2" : "",
  props.end ? "me-2" : "",
]);

const computedImageClasses = computed(() => [
  "w-full h-full object-cover",
]);

const computedIconClasses = computed(() => [
  "absolute text-ui-inverse text-xl",
]);

const computedTextClasses = computed(() => [
  "text-center font-semibold",
]);
</script>
