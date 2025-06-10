<template>
  <component :is="tag" v-bind="$attrs" :class="computedClasses" @click="$emit('click', $event)"
    @mouseover="$emit('hover', $event)" @contextmenu="$emit('contextmenu', $event)" @focus="$emit('focus', $event)">
    <img v-if="image" :src="image" :alt="alt" :class="computedImageClasses" />
    <span v-else-if="icon" :class="computedIconClasses">{{ icon }}</span>
    <span v-else-if="text" :class="computedTextClasses">{{ text }}</span>
    <slot v-if="!image && !icon && !text"></slot>
  </component>
</template>

<script setup>
import { computed } from "vue";

defineProps({
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
  sizes[size] || sizes.default,
  rounded ? "rounded-full" : tile ? "rounded-none" : "rounded",
  border ? `border border-${border}` : "",
  color ? `bg-${color}` : "bg-gray-200",
  density === "compact" ? "p-1" : density === "comfortable" ? "p-2" : "p-3",
  start ? "ms-2" : "",
  end ? "me-2" : "",
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
