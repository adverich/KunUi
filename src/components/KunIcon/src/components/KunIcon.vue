<template>
  <span
    class="flex items-center"
    :class="[color, size, disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer']"
    @click="handleClick"
     v-bind="$attrs"
  >
    <!-- Si hay slot, lo usa -->
    <slot v-if="$slots.default" />

    <!-- Si el icono es un componente, lo renderiza -->
    <component v-else-if="isComponent" :is="resolvedIcon" :class="[color, size, contentClass]" />

    <!-- Si es una string, la interpreta como clase o SVG raw (dependiendo del consumidor) -->
    <span v-else 
      :class="[!isSvg ? resolvedIcon : '', color, size, contentClass]"
      v-html="[isSvg ? resolvedIcon : '']" 
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

const isSvg = computed(() => typeof resolvedIcon.value === 'string' && resolvedIcon.value.trim().startsWith('<svg'));
const resolvedIcon = computed(() => {
  if (typeof props.icon === 'string' && props.icon.startsWith('$')) {
    const key = props.icon.slice(1);
    return props.aliases[key] || '';
  }
  return props.icon;
});

const isComponent = computed(() =>
  typeof resolvedIcon.value === 'function' ||
  (typeof resolvedIcon.value === 'object' && resolvedIcon.value !== null)
);
</script>
