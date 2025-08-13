<script setup>
import { computed } from "vue"

const props = defineProps({
  loading: { type: Boolean, default: true },
  variant: { type: String, default: "rect" }, // rect, circle, text
  width: { type: [String, Number], default: "100%" },
  height: { type: [String, Number], default: "1rem" },
  rounded: { type: String, default: "md" }, // none, sm, md, lg, full
  animation: { type: String, default: "shimmer" }, // shimmer, pulse, shimmer-vertical, none
  duration: { type: Number, default: 1500 }, // ms
  colorFrom: { type: String, default: "bg-gray-200" },
  colorTo: { type: String, default: "bg-gray-300" },
  repeat: { type: Boolean, default: true },
  class: { type: [String, Array, Object], default: "" }
})

// 🔹 Clases base para forma
const shapeClass = computed(() => {
  switch (props.variant) {
    case "circle":
      return "rounded-full aspect-square"
    case "text":
      return "rounded-sm"
    default:
      return `rounded-${props.rounded}`
  }
})

// 🔹 Animaciones
const animationClass = computed(() => {
  if (props.animation === "none") return ""
  if (props.animation === "pulse") return "animate-pulse"
  if (props.animation === "shimmer") return "bg-gradient-to-r from-transparent via-white/50 to-transparent bg-[length:200%_100%] animate-[shimmerX_var]".replace("var", `${props.duration}ms`)
  if (props.animation === "shimmer-vertical") return "bg-gradient-to-b from-transparent via-white/50 to-transparent bg-[length:100%_200%] animate-[shimmerY_var]".replace("var", `${props.duration}ms`)
  return ""
})

// 🔹 Clases finales
const mergedClass = computed(() => [
  "relative overflow-hidden",
  props.colorFrom,
  props.colorTo,
  shapeClass.value,
  animationClass.value,
  props.class
])

// 🔹 Estilos en línea (medidas personalizadas)
const sizeStyle = computed(() => ({
  width: typeof props.width === "number" ? `${props.width}px` : props.width,
  height: typeof props.height === "number" ? `${props.height}px` : props.height
}))
</script>

<template>
  <div v-if="loading" :class="mergedClass" :style="sizeStyle"></div>
  <slot v-else />
</template>

<!-- Animaciones Keyframes con Tailwind (configurable desde tailwind.config.js) -->
