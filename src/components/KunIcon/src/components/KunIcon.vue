<template>
  <span
    class="flex items-center"
    :class="[color, size, disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer']"
    @click="handleClick"
  >
    <!-- Si hay slot, lo usa -->
    <slot v-if="$slots.default" />

    <!-- Si el icono es un componente, lo renderiza -->
    <component v-else-if="isComponent" :is="resolvedIcon" />

    <!-- Si es una string, la interpreta como clase o SVG raw (dependiendo del consumidor) -->
    <span v-else :class="resolvedIcon" />
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
    default: 'text-xs'
  },
  color: {
    type: String,
    default: 'text-font-color'
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click']);

function handleClick(event) {
  if (!props.disabled) emit('click', event);
}

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
