<template>
  <div
    class="relative inline-block animate-spin"
    :style="spinnerStyle"
    role="status"
    aria-label="Loading"
    v-bind="$attrs"
  />
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  size: {
    type: [Number, String],
    default: 48,
  },
  width: {
    type: [Number, String],
    default: 6,
  },
  gradient: {
    type: String,
    default: 'conic-gradient(from 0deg, #e5e7eb, #3b82f6)',
  },
});

const parsedSize = computed(() => Number(props.size));
const parsedWidth = computed(() => Number(props.width));

// Estilo del spinner con centro transparente
const spinnerStyle = computed(() => {
  const sizePx = parsedSize.value;
  const widthPx = parsedWidth.value;
  const radius = sizePx / 2;
  const innerRadius = radius - widthPx;

  return {
    width: `${sizePx}px`,
    height: `${sizePx}px`,
    backgroundImage: props.gradient,
    borderRadius: '50%',
    WebkitMaskImage: `radial-gradient(circle ${innerRadius}px at center, transparent ${innerRadius}px, white ${radius}px)`,
    maskImage: `radial-gradient(circle ${innerRadius}px at center, transparent ${innerRadius}px, white ${radius}px)`,
    WebkitMaskComposite: 'destination-in',
    maskComposite: 'intersect',
  };
});
</script>
