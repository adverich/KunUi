<template>
  <div class="kun-tooltip relative inline-block">
    <!-- Slot para el activador -->
    <slot name="activator" :props="activatorProps">
      <!-- Fallback si no hay slot -->
      <span ref="activator" class="kun-tooltip-activator">
        <slot />
      </span>
    </slot>

    <!-- Tooltip Content -->
    <transition name="fade">
      <div
        v-if="isVisible"
        ref="tooltip"
        :class="[
          'kun-tooltip-content',
          'absolute z-50 px-2 py-1 text-sm rounded shadow-lg text-white bg-gray-800 dark:bg-gray-700 whitespace-nowrap',
          props.contentClass
        ]"
        :style="positionStyle"
      >
        {{ props.text }}
        <slot>{{ props.text }}</slot>
        <div :class="['kun-tooltip-arrow', arrowClass]" :style="arrowStyle"></div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, useSlots } from 'vue'
import { useTooltip } from '../composables/useTooltip'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: 'top',
    validator: value => ['top', 'bottom', 'left', 'right'].includes(value)
  },
  openOn: {
    type: String,
    default: 'hover',
    validator: value => ['hover', 'click'].includes(value)
  },
  disabled: Boolean,
  contentClass: {
    type: [String, Object, Array],
    default: null
  },
  delay: {
    type: [String, Number],
    default: 0,
    validator: v => !isNaN(parseInt(v))
  },
  closeOnClick: {
    type: Boolean,
    default: false
  },
  transition: {
    type: String,
    default: 'fade'
  }
})

const slots = useSlots()

const activatorProps = computed(() => {
  if (!slots.activator) return {}
  return {
    onMouseenter: onEnter,
    onMouseleave: onLeave,
    onClick: onClick
  }
})

const {
  isVisible,
  positionClass,
  arrowClass,
  positionStyle,
  arrowStyle,
  onEnter,
  onLeave,
  onClick
} = useTooltip(props)

// Para soportar el uso del tooltip sin slot activator
const activator = ref(null)
onMounted(() => {
  if (!slots.activator && activator.value) {
    // Si usamos el fallback span, asignamos eventos
    const el = activator.value
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    el.addEventListener('click', onClick)
  }
})
</script>