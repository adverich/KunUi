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
        :aria-hidden="!isVisible"
        @mouseenter="onTooltipEnter"
        @mouseleave="onTooltipLeave"
      >
        <slot>{{ text }}</slot>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount, nextTick, useId, type Ref } from 'vue'
import { kunTooltipProps } from '../composables/kunTooltipProps.js'
import { useTooltipPosition, type TooltipLocation, type TooltipDist } from '../composables/useTooltipPosition.js'

const props = defineProps(kunTooltipProps)

// ID único por tooltip
const tooltipId = props.id || `tooltip-${useId()}`

const isVisible = ref(false)
const activatorRef: Ref<HTMLElement | null> = ref(null)
const tooltipRef: Ref<HTMLElement | null> = ref(null)

const { tooltipStyle, updatePosition } = useTooltipPosition(
  activatorRef,
  tooltipRef,
  isVisible,
  () => ({
    location: props.location as TooltipLocation,
    flip: props.flip as boolean,
    dist: props.dist as TooltipDist,
  }),
)

// Timers
let openTimer: ReturnType<typeof setTimeout> | null = null
let closeTimer: ReturnType<typeof setTimeout> | null = null
let safetyTimer: ReturnType<typeof setTimeout> | null = null
let pending = false

function clearTimer(timer: ReturnType<typeof setTimeout> | null): void {
  if (timer) clearTimeout(timer)
}

function show(): void {
  if (props.disabled || isVisible.value || pending) return

  clearTimer(openTimer)
  clearTimer(closeTimer)
  clearTimer(safetyTimer)

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

function hide(): void {
  clearTimer(openTimer)
  clearTimer(closeTimer)
  clearTimer(safetyTimer)

  if (!isVisible.value && !pending) return

  closeTimer = setTimeout(() => {
    isVisible.value = false
    pending = false
  }, +props.closeDelay)
}

function toggle(): void {
  isVisible.value ? hide() : show()
}

function onTooltipEnter(): void {
  clearTimer(closeTimer)
  clearTimer(safetyTimer)
}

function onTooltipLeave(): void {
  hide()
}

// Props para activador
const activatorProps = computed(() => {
  if (props.disabled) return {}
  const listeners: Record<string, () => void> = {}
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
  clearTimer(openTimer)
  clearTimer(closeTimer)
  clearTimer(safetyTimer)
  isVisible.value = false
})
</script>

