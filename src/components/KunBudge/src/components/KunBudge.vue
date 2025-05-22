<script setup>
import { computed } from 'vue';

defineProps({
    text: { type: String, default: '' },
    bgColor: { type: String, default: 'bg-red-500' },
    textColor: { type: String, default: 'text-white' },
    textSize: { type: String, default: 'text-xs' },
    fontWeight: { type: String, default: 'font-bold' },
    rounded: { type: String, default: 'rounded-full' },
    dot: { type: Boolean, default: false }, // Modo punto
    visible: { type: Boolean, default: true }, // Mostrar u ocultar
});

const badgeClasses = computed(() => [
    'absolute top-0 right-0 flex items-center justify-center px-2 py-1',
    'transform translate-x-1/2 -translate-y-1/2',
    'min-w-[20px] min-h-[20px]',
]);
</script>

<template>
  <div class="relative inline-block">
    <slot /> <!-- Contenido que envuelve el badge -->
    <div v-if="visible" :class="[...badgeClasses, bgColor, textColor, textSize, fontWeight, rounded]">
      <span v-if="!dot">{{ text }}</span>
    </div>
  </div>
</template>
