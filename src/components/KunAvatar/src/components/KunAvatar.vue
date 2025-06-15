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
import { computed } from "vue";

const props = defineProps({
  image: String,
  icon: String,
  text: String,
  alt: String,
  size: { type: [String, Number], default: "default" },
  rounded: { type: [String, Number, Boolean], default: undefined },
  border: { type: [String, Number, Boolean], default: false },
  color: { type: String, default: undefined },
  density: { type: String, default: "default" },
  end: Boolean,
  start: Boolean,
  tag: { type: String, default: "div" },
  theme: String,
  tile: Boolean,
  variant: { type: String, default: "flat" },
});

defineEmits(["click", "hover", "contextmenu", "focus"]);

const sizes = {
  "x-small": "w-6 h-6 text-xs",
  small: "w-8 h-8 text-sm",
  default: "w-12 h-12 text-base",
  large: "w-16 h-16 text-lg",
  "x-large": "w-24 h-24 text-xl",
};

const computedClasses = computed(() => [
  "relative flex items-center justify-center overflow-hidden cursor-pointer transition-all",
  sizes[props.size] || sizes.default,
  props.rounded ? "rounded-full" : props.tile ? "rounded-none" : "rounded",
  props.border ? `border border-${props.border}` : "",
  props.color ? `bg-${props.color}` : "bg-gray-200",
  props.density === "compact" ? "p-1" : props.density === "comfortable" ? "p-2" : "p-3",
  props.start ? "ms-2" : "",
  props.end ? "me-2" : "",
]);

const computedImageClasses = computed(() => [
  "w-full h-full object-cover",
]);

const computedIconClasses = computed(() => [
  "absolute text-white text-xl",
]);

const computedTextClasses = computed(() => [
  "text-center font-semibold",
]);
</script>
