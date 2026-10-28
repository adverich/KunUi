<script setup lang="ts">
import { computed } from "vue"
import { kunSkeletonProps } from '../composables/kunSkeletonProps.js'

const props = defineProps(kunSkeletonProps)

// 🔹 Clases base para forma (claramente distintas entre sí)
const shapeClass = computed(() => {
  switch (props.variant) {
    case "circle":
      // Círculo perfecto: el tamaño se fuerza cuadrado en skeletonStyle
      return "rounded-full shrink-0"
    case "text":
      // Línea de texto: píldora, visiblemente distinta del bloque rect
      return "rounded-full"
    default:
      return `rounded-${props.rounded}`
  }
})

// 🔹 Animación (clases propias con keyframes reales en <style scoped>)
const animationClass = computed(() => {
  switch (props.animation) {
    case "shimmer":
      return "kun-skeleton--shimmer"
    case "shimmer-vertical":
      return "kun-skeleton--shimmer-y"
    case "wave":
      return "kun-skeleton--wave"
    case "pulse":
      return "kun-skeleton--pulse"
    default:
      return ""
  }
})

// 🔹 Clases finales (colorTo reservado: no se aplica para no pisar el fondo)
const mergedClass = computed(() => [
  "kun-skeleton",
  props.colorFrom,
  shapeClass.value,
  animationClass.value,
  props.class
])

// 🔹 Estilos en línea (medidas + duración configurable)
// En 'circle' se fuerza un cuadrado perfecto: usa width, salvo que sea
// porcentaje (p. ej. el "100%" por defecto), en cuyo caso usa height.
const toCssSize = (v: string | number) => (typeof v === "number" ? `${v}px` : v)
const skeletonStyle = computed(() => {
  const style: Record<string, string> = {
    "--kun-skeleton-duration": `${props.duration}ms`,
  }
  if (props.variant === "circle") {
    const w = toCssSize(props.width)
    const size = w.trim().endsWith("%") ? toCssSize(props.height) : w
    style.width = size
    style.height = size
  } else {
    style.width = toCssSize(props.width)
    style.height = toCssSize(props.height)
  }
  return style
})
</script>

<template>
  <div v-if="loading" :class="mergedClass" :style="skeletonStyle" aria-busy="true" />
  <slot v-else />
</template>

<style scoped>
.kun-skeleton {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  /* Brillo adaptativo: superficie elevada sobre el fondo base.
     En claro es blanco sobre gris; en oscuro es elevado sobre hover. */
  --kun-skeleton-sheen: var(--kun-bg-elevated);
}

.kun-skeleton--shimmer::after,
.kun-skeleton--shimmer-y::after,
.kun-skeleton--wave::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* Barrido horizontal suave con pausa agradable al final del ciclo */
.kun-skeleton--shimmer::after {
  background: linear-gradient(
    100deg,
    transparent 10%,
    var(--kun-skeleton-sheen) 50%,
    transparent 90%
  );
  transform: translateX(-100%);
  animation: kun-skeleton-shimmer var(--kun-skeleton-duration, 1600ms) ease-in-out infinite;
  will-change: transform;
}

/* Barrido vertical suave */
.kun-skeleton--shimmer-y::after {
  background: linear-gradient(
    180deg,
    transparent 10%,
    var(--kun-skeleton-sheen) 50%,
    transparent 90%
  );
  transform: translateY(-100%);
  animation: kun-skeleton-shimmer-y var(--kun-skeleton-duration, 1600ms) ease-in-out infinite;
  will-change: transform;
}

/* Onda continua: banda inclinada que oscila sin pausa (difiere del
   barrido con pausa de shimmer: aquí el movimiento nunca se detiene) */
.kun-skeleton--wave::after {
  inset: -25%;
  background: linear-gradient(
    100deg,
    transparent 35%,
    var(--kun-skeleton-sheen) 50%,
    transparent 65%
  );
  transform: translateX(-35%) skewX(-12deg);
  animation: kun-skeleton-wave var(--kun-skeleton-duration, 1600ms) ease-in-out infinite alternate;
  will-change: transform;
}

/* Pulso suave propio (respeta duration, a diferencia de animate-pulse fijo) */
.kun-skeleton--pulse {
  animation: kun-skeleton-pulse var(--kun-skeleton-duration, 1600ms) ease-in-out infinite;
  will-change: opacity;
}

@keyframes kun-skeleton-shimmer {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  60% {
    transform: translateX(100%);
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes kun-skeleton-shimmer-y {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  60% {
    transform: translateY(100%);
    opacity: 1;
  }
  100% {
    transform: translateY(100%);
    opacity: 0;
  }
}

@keyframes kun-skeleton-wave {
  from {
    transform: translateX(-35%) skewX(-12deg);
  }
  to {
    transform: translateX(35%) skewX(-12deg);
  }
}

@keyframes kun-skeleton-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.45;
  }
}

@media (prefers-reduced-motion: reduce) {
  .kun-skeleton--shimmer::after,
  .kun-skeleton--shimmer-y::after,
  .kun-skeleton--wave::after,
  .kun-skeleton--pulse {
    animation: none;
  }
}
</style>
