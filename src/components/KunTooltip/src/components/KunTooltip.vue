<template>
  <!-- Activador -->
  <span ref="activatorRef" v-bind="activatorProps">
    <slot name="activator" :props="activatorProps" />
  </span>

  <!-- Tooltip -->
  <teleport to="body" v-if="!disabled">
    <transition :name="transition">
      <div
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
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick
} from 'vue'

const props = defineProps({
  class: [String, Array, Object],
  text: String,
  location: {
    type: String,
    default: 'top',
  },
  openOn: {
    type: String,
    default: 'hover', // 'click' | 'hover' | 'focus'
  },
  transition: {
    type: String,
    default: 'fade',
  },
  disabled: Boolean,
  delay: {
    type: [Number, String],
    default: 0,
  },
  closeDelay: {
    type: [Number, String],
    default: 100,
  },
  textColor: { type: String, default: 'text-black dark:text-white' },
  bgColor: { type: String, default: 'bg-gray-600:75 dark:bg-gray-700/75 '},
  rounded: { type: String, default: 'rounded '},
  textSize: { type: String, default: 'text-sm' },
  dist: {
    type: [Number, Object],
    default: () => ({ x: 0, y: 8 })
  },
  disabled: Boolean,
})

const isVisible = ref(false)
const activatorRef = ref(null)
const tooltipRef = ref(null)
const tooltipStyle = ref({})

let openTimer = null
let closeTimer = null

function show() {
  if (props.disabled || isVisible.value) return
  clearTimeout(closeTimer)
  console.log('[Tooltip] show triggered')
  openTimer = setTimeout(() => {
    console.log('[Tooltip] show timeout executed')
    if (!activatorRef.value) return // previene mostrar tooltip si ya no hay activador
    isVisible.value = true
    updatePosition()
  }, +props.delay)
}

function hide() {
  if (!isVisible.value) return
  clearTimeout(openTimer)
  console.log('[Tooltip] hide triggered')
  closeTimer = setTimeout(() => {
    console.log('[Tooltip] hide timeout executed')
    isVisible.value = false
  }, +props.closeDelay)
}

function toggle() {
  isVisible.value ? hide() : show()
}

function onTooltipEnter() {
  clearTimeout(closeTimer)
}
function onTooltipLeave() {
  hide()
}

const activatorProps = computed(() => {
  if (props.disabled) return {}

  const listeners = {}

  if (props.openOn === 'hover') {
    listeners.onMouseenter = show
    listeners.onMouseleave = hide
  }

  if (props.openOn === 'click') {
    listeners.onClick = toggle
  }

  if (props.openOn === 'focus') {
    listeners.onFocus = show
    listeners.onBlur = hide
  }

  return listeners
})

const baseClass="absolute px-3 py-2 shadow";
const mergedClass = computed(() => [baseClass, props.textColor, props.bgColor, props.textSize, props.rounded, props.class]);

const offset = computed(() => {
  if (typeof props.dist === 'number') {
    return { x: 0, y: props.dist }
  }
  return { x: props.dist.x ?? 0, y: props.dist.y ?? 0 }
});

function updatePosition() {
  const activator = activatorRef.value
  const tooltip = tooltipRef.value
  if (!activator || !tooltip) return

  const activatorRect = activator.getBoundingClientRect()
  const tooltipRect = tooltip.getBoundingClientRect()
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

  const { x, y } = offset.value;

  const positions = {
    top: {
      top: `${activatorRect.top + scrollTop - tooltipRect.height - y}px`,
      left: `${activatorRect.left + scrollLeft + activatorRect.width / 2 - tooltipRect.width / 2 + x}px`,
    },
    bottom: {
      top: `${activatorRect.bottom + scrollTop + y}px`,
      left: `${activatorRect.left + scrollLeft + activatorRect.width / 2 - tooltipRect.width / 2 + x}px`,
    },
    left: {
      top: `${activatorRect.top + scrollTop + activatorRect.height / 2 - tooltipRect.height / 2 + y}px`,
      left: `${activatorRect.left + scrollLeft - tooltipRect.width - x}px`,
    },
    right: {
      top: `${activatorRect.top + scrollTop + activatorRect.height / 2 - tooltipRect.height / 2 + y}px`,
      left: `${activatorRect.right + scrollLeft + x}px`,
    },
  }

  tooltipStyle.value = positions[props.location]
}

const onScrollOrResize = () => {
  if (isVisible.value) updatePosition()
}

onMounted(() => {
  window.addEventListener('scroll', onScrollOrResize)
  window.addEventListener('resize', onScrollOrResize)
})

onBeforeUnmount(() => {
  clearTimeout(openTimer)
  clearTimeout(closeTimer)
  isVisible.value = false
  window.removeEventListener('scroll', onScrollOrResize)
  window.removeEventListener('resize', onScrollOrResize)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
