<template>
  <span
    class="flex items-center"
    :class="[color, normalizedSize, disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer']"
    @click="handleClick"
     v-bind="$attrs"
  >
    <!-- Si hay slot, lo usa -->
    <slot v-if="$slots.default" />

    <!-- Si el icono es un componente, lo renderiza -->
    <component v-else-if="isComponent" :is="resolvedIcon" :class="[color, normalizedSize, contentClass]" />

    <!-- Si es una string, la interpreta como clase o SVG raw (dependiendo del consumidor) -->
    <span v-else 
      :class="[!isSvg ? resolvedIcon : '', color, normalizedSize, contentClass]"
      v-html="isSvg ? resolvedIcon : ''" 
    />
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  icon: {
    type: [String, Object, Function],
    required: false
  },
  aliases: {
    type: Object,
    default: () => ({})
  },
  size: {
    type: String,
    default: 'text-md'
  },
  color: {
    type: String,
    default: 'text-font-color'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  contentClass: [String, Array, Object],
});

const emit = defineEmits(['click']);

function handleClick(event) {
  if (!props.disabled) emit('click', event);
}

const isSvg = computed(() =>
  typeof resolvedIcon.value === 'string' &&
  resolvedIcon.value.trim().toLowerCase().startsWith('<svg')
)

const resolvedIcon = computed(() => {
  if (Array.isArray(props.icon)) return props.icon[0];
  if (typeof props.icon === 'string' && props.icon.startsWith('$')) {
    const key = props.icon.slice(1);
    return props.aliases[key] || '';
  }
  return props.icon;
});

const isComponent = computed(() =>
  typeof resolvedIcon.value === 'function' ||
  (resolvedIcon.value && typeof resolvedIcon.value === 'object' && ('render' in resolvedIcon.value || 'setup' in resolvedIcon.value))
);

const normalizedSize = computed(() => {
  const rawSize = Array.isArray(props.icon) ? props.icon[1] : props.size;
  if (!rawSize) return 'text-base';
  if (typeof rawSize === 'number' || /^\d+$/.test(rawSize)) {
    return `text-[${rawSize}px]`;
  }
  return rawSize;
});
</script>
