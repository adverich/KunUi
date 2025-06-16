<template>
  <!-- Activador -->
  <span ref="activatorRef" v-bind="activatorProps">
    <slot name="activator" :props="activatorProps" />
  </span>

  <!-- Tooltip -->
  <teleport to="body">
    <transition :name="transition">
      <div
        v-show="isVisible"
        ref="tooltipRef"
        class="absolute px-3 py-2 text-sm rounded shadow text-black dark:text-white bg-gray-600:75 dark:bg-gray-700/75"
        :class="contentClass"
        :style="tooltipStyle"
        style="z-index: 9999;"
        role="tooltip"
        aria-hidden="!isVisible"
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
  nextTick,
  watch,
} from 'vue'

const props = defineProps({
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
  contentClass: [String, Array, Object],
  disabled: Boolean,
  delay: {
    type: [Number, String],
    default: 0,
  },
  closeDelay: {
    type: [Number, String],
    default: 100,
  },
})

const isVisible = ref(false)
const activatorRef = ref(null)
const tooltipRef = ref(null)
const tooltipStyle = ref({})

let openTimer = null
let closeTimer = null

function show() {
  if (props.disabled) return
  clearTimeout(closeTimer)
  openTimer = setTimeout(async () => {
    isVisible.value = true
    await nextTick()
    updatePosition()
  }, +props.delay)
}

function hide() {
  clearTimeout(openTimer)
  closeTimer = setTimeout(() => {
    isVisible.value = false
  }, +props.closeDelay)
}

function toggle() {
  isVisible.value ? hide() : show()
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

function updatePosition() {
  const activator = activatorRef.value
  const tooltip = tooltipRef.value
  if (!activator || !tooltip) return

  const activatorRect = activator.getBoundingClientRect()
  const tooltipRect = tooltip.getBoundingClientRect()
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

  const positions = {
    top: {
      top: `${activatorRect.top + scrollTop - tooltipRect.height - 16}px`,
      left: `${activatorRect.left + scrollLeft + activatorRect.width / 2 - tooltipRect.width / 2}px`,
    },
    bottom: {
      top: `${activatorRect.bottom + scrollTop + 8}px`,
      left: `${activatorRect.left + scrollLeft + activatorRect.width / 2 - tooltipRect.width / 2}px`,
    },
    left: {
      top: `${activatorRect.top + scrollTop + activatorRect.height / 2 - tooltipRect.height / 2}px`,
      left: `${activatorRect.left + scrollLeft - tooltipRect.width - 8}px`,
    },
    right: {
      top: `${activatorRect.top + scrollTop + activatorRect.height / 2 - tooltipRect.height / 2}px`,
      left: `${activatorRect.right + scrollLeft + 8}px`,
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
