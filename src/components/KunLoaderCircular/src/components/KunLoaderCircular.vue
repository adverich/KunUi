<template>
  <Teleport v-if="fullscreen" to="body">
    <div class="fixed inset-0 flex justify-center items-center bg-black/75 z-[2500]">
      <div class="w-1/2 h-1/2 text-center flex flex-col items-center justify-center -mt-[180px]">
        Cargando datos
        <div
          class="relative inline-block animate-spin mt-4"
          :style="spinnerStyle"
          role="status"
          aria-label="Loading"
          v-bind="$attrs"
        />
      </div>
    </div>
  </Teleport>
  <div v-else class="inline-block">
    <div
      class="relative animate-spin"
      :style="spinnerStyle"
      role="status"
      aria-label="Loading"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  fullscreen: {
    type: Boolean,
    default: false,
  },
  size: {
    type: [Number, String],
    default: 24, // 🔹 Pequeño por defecto para botones
  },
  width: {
    type: [Number, String],
    default: 4, // 🔹 Grosor adecuado para el botón
  },
  gradient: {
    type: String,
    default: 'conic-gradient(from 0deg, #ffffff, #3b82f6)',
  },
});

const parsedSize = computed(() => Number(props.size));
const parsedWidth = computed(() => Number(props.width));

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
    WebkitMaskImage: `radial-gradient(circle ${innerRadius}px at center, rgba(255,255,255,0.1) ${innerRadius}px, white ${radius}px)`,
    maskImage: `radial-gradient(circle ${innerRadius}px at center, rgba(255,255,255,0.1) ${innerRadius}px, white ${radius}px)`,
    WebkitMaskComposite: 'destination-in',
    maskComposite: 'intersect',
  };
});
</script>
