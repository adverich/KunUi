<template>
  <!-- Activador -->
  <span ref="activatorRef" v-bind="activatorProps">
    <slot name="activator" :props="activatorProps" />
  </span>

  <!-- Tooltip -->
  <teleport to="body" v-if="!disabled">
    <transition :name="transition">
      <div
        :id="tooltipId"
        v-show="isVisible"
        ref="tooltipRef"
        :class="mergedClass"
        :style="tooltipStyle"
        style="z-index: 9999;"
        role="tooltip"
        aria-hidden="!isVisible"
        @mouseenter="onTooltipEnter"
        @mouseleave="onTooltipLeave"
      >
        <slot>{{ text }}</slot>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  class: [String, Array, Object],
  text: String,
  location: { type: String, default: 'top' },
  openOn: { type: String, default: 'hover' },
  transition: { type: String, default: 'fade' },
  disabled: Boolean,
  delay: { type: [Number, String], default: 0 },
  closeDelay: { type: [Number, String], default: 100 },
  textColor: { type: String, default: 'text-black dark:text-white' },
  bgColor: { type: String, default: 'bg-gray-600/75 dark:bg-gray-700/75' },
  rounded: { type: String, default: 'rounded' },
  textSize: { type: String, default: 'text-sm' },
  dist: { type: [Number, Object], default: () => ({ x: 0, y: 8 }) },
})

// ID único por tooltip
const tooltipId = 'tooltip-' + Math.random().toString(36).slice(2, 11)

const isVisible = ref(false)
const activatorRef = ref(null)
const tooltipRef = ref(null)
const tooltipStyle = ref({})

// Timers
let openTimer = null
let closeTimer = null
let safetyTimer = null
let pending = false

function show() {
  if (props.disabled || isVisible.value || pending) return

  clearTimeout(openTimer)
  clearTimeout(closeTimer)
  clearTimeout(safetyTimer)

  pending = true
  openTimer = setTimeout(async () => {
    pending = false
    if (!activatorRef.value) return

    isVisible.value = true
    await nextTick()
    updatePosition()

    // Timer de seguridad: oculta tooltip automáticamente a los 5 segundos
    safetyTimer = setTimeout(() => {
      hide()
    }, 5000)
  }, +props.delay)
}

function hide() {
  clearTimeout(openTimer)
  clearTimeout(closeTimer)
  clearTimeout(safetyTimer)

  if (!isVisible.value && !pending) return

  closeTimer = setTimeout(() => {
    isVisible.value = false
    pending = false
  }, +props.closeDelay)
}

function toggle() {
  isVisible.value ? hide() : show()
}

function onTooltipEnter() {
  clearTimeout(closeTimer)
  clearTimeout(safetyTimer)
}

function onTooltipLeave() {
  hide()
}

// Props para activador
const activatorProps = computed(() => {
  if (props.disabled) return {}
  const listeners = {}
  if (props.openOn === 'hover') {
    listeners.onMouseenter = show
    listeners.onMouseleave = hide
  }
  if (props.openOn === 'click') listeners.onClick = toggle
  if (props.openOn === 'focus') {
    listeners.onFocus = show
    listeners.onBlur = hide
  }
  return listeners
})

// Clases
const baseClass = "absolute px-3 py-2 shadow"
const mergedClass = computed(() => [baseClass, props.textColor, props.bgColor, props.textSize, props.rounded, props.class])

const offset = computed(() => {
  if (typeof props.dist === 'number') return { x: 0, y: props.dist }
  return { x: props.dist.x ?? 0, y: props.dist.y ?? 0 }
})

// Posicionamiento
function updatePosition() {
  const a = activatorRef.value?.getBoundingClientRect()
  const t = tooltipRef.value?.getBoundingClientRect()
  if (!a || !t) return

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
  const { x, y } = offset.value

  const positions = {
    top:    { top: `${a.top + scrollTop - t.height - y}px`, left: `${a.left + scrollLeft + a.width/2 - t.width/2 + x}px` },
    bottom: { top: `${a.bottom + scrollTop + y}px`, left: `${a.left + scrollLeft + a.width/2 - t.width/2 + x}px` },
    left:   { top: `${a.top + scrollTop + a.height/2 - t.height/2 + y}px`, left: `${a.left + scrollLeft - t.width - x}px` },
    right:  { top: `${a.top + scrollTop + a.height/2 - t.height/2 + y}px`, left: `${a.right + scrollLeft + x}px` },
  }

  tooltipStyle.value = positions[props.location] || positions.top
}

// Scroll / Resize
const onScrollOrResize = () => { if (isVisible.value) updatePosition() }

onMounted(() => {
  window.addEventListener('scroll', onScrollOrResize)
  window.addEventListener('resize', onScrollOrResize)
})

onBeforeUnmount(() => {
  clearTimeout(openTimer)
  clearTimeout(closeTimer)
  clearTimeout(safetyTimer)
  isVisible.value = false
  window.removeEventListener('scroll', onScrollOrResize)
  window.removeEventListener('resize', onScrollOrResize)
})
</script>
