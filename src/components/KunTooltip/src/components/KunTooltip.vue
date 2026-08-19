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
import { ref, computed, onBeforeUnmount, nextTick } from 'vue'
import { kunTooltipProps } from '../composables/kunTooltipProps'
import { useTooltipPosition } from '../composables/useTooltipPosition'

const props = defineProps(kunTooltipProps)

// ID único por tooltip
const tooltipId = 'tooltip-' + Math.random().toString(36).slice(2, 11)

const isVisible = ref(false)
const activatorRef = ref(null)
const tooltipRef = ref(null)

const { tooltipStyle, updatePosition } = useTooltipPosition(
  activatorRef,
  tooltipRef,
  isVisible,
  () => ({
    location: props.location,
    flip: props.flip,
    dist: props.dist,
  }),
)

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
const baseClass = 'fixed px-3 py-2 shadow'
const mergedClass = computed(() => [baseClass, props.textColor, props.bgColor, props.textSize, props.rounded, props.class])

onBeforeUnmount(() => {
  clearTimeout(openTimer)
  clearTimeout(closeTimer)
  clearTimeout(safetyTimer)
  isVisible.value = false
})
</script>
