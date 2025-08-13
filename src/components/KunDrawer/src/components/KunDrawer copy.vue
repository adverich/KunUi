<template>
  <!-- Drawer -->
  <component
    v-show="modelValue || permanent || isDragging"
    :is="tag"
    ref="drawerEl"
    class="fixed z-[2001] flex flex-col"
    :class="[
      computedClass,
      absolute ? 'absolute' : 'fixed',
      floating ? 'border-none' : '',
      isDragging ? 'transition-none' : swipeTransition,
    ]"
    :style="drawerStyle"
    @click.stop
    @touchstart.passive="onTouchStart"
    @touchmove.passive="onTouchMove"
    @touchend.passive="onTouchEnd"
  >
    <slot name="prepend" />
    <slot />
    <slot name="append" />
  </component>

  <!-- Scrim -->
  <Transition name="kun-scrim">
    <div
      v-if="scrim && (modelValue || isDragging) && !permanent && !persistent"
      class="fixed inset-0 bg-black/40 z-30"
      @click="close"
    />
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAppbarHeight } from '@/utils/useLayout'

const emits = defineEmits(['update:model-value'])

const props = defineProps({
  modelValue: Boolean,
  absolute: Boolean,
  border: [Boolean, String, Number],
  color: String,
  elevation: [String, Number],
  floating: Boolean,
  image: String,
  location: {
    type: String,
    default: 'start', // start | end | left | right | top | bottom
  },
  permanent: Boolean,
  persistent: Boolean,
  rail: Boolean,
  railWidth: { type: String, default: 'w-[56px]' },
  rounded: [Boolean, String, Number],
  scrim: { type: [Boolean, String], default: true },
  tag: { type: [String, Object], default: 'nav' },
  temporary: Boolean,
  width: { type: String, default: 'w-[256px]' },
  fullHeight: Boolean,
  scrollable: { type: Boolean, default: true },

  /* --- NUEVAS --- */
  swipeable: { type: Boolean, default: false },
  swipeThreshold: { type: Number, default: 50 },
  swipeEdgeSize: { type: Number, default: 30 },
  swipeTransition: { type: String, default: 'transition-transform duration-300 ease-in-out' }
})

const appbarHeight = useAppbarHeight();
const drawerEl = ref(null)

/* Posición y dimensiones */
const computedTop = computed(() =>
  props.fullHeight ? '0px' : `${appbarHeight.value}px`
)
const computedHeight = computed(() =>
  props.fullHeight
    ? (window.innerWidth < 768 ? '100dvh' : '100vh')
    : `calc(100vh - ${appbarHeight.value}px)`
)
const widthClass = computed(() => props.rail ? props.railWidth : props.width)
const positionClass = computed(() => {
  const pos = props.location
  switch (pos) {
    case 'start':
    case 'left': return 'left-0 top-0 h-full'
    case 'end':
    case 'right': return 'right-0 top-0 h-full'
    case 'top': return 'top-0 left-0 w-full'
    case 'bottom': return 'bottom-0 left-0 w-full'
    default: return 'left-0 top-0 h-full'
  }
})
const isStart = computed(() => ['start', 'left'].includes(props.location))
const isEnd = computed(() => ['end', 'right'].includes(props.location))
const borderClass = computed(() => {
  if (!props.border) return ''
  if (typeof props.border === 'string') return `border-${props.border}`
  return 'border'
})
const roundedClass = computed(() => {
  if (props.rounded === true) return 'rounded-r'
  if (typeof props.rounded === 'string') return props.rounded
  if (typeof props.rounded === 'number') return `rounded-[${props.rounded}px]`
  return ''
})
const computedClass = computed(() => {
  return [
    positionClass.value,
    widthClass.value,
    borderClass.value,
    props.elevation ? `shadow-${props.elevation}` : '',
    roundedClass.value,
    props.color ?? 'bg-surface-dark',
    props.scrollable ? 'overflow-auto' : ''
  ]
})

/* --- Swipe handling --- */
const startX = ref(0)
const currentX = ref(0)
const isDragging = ref(false)
const drawerWidth = ref(0)

const drawerStyle = computed(() => {
  if (!props.swipeable) return { top: computedTop.value, height: computedHeight.value }
  let translate = 0

  if (isDragging.value) {
    const delta = currentX.value - startX.value
    if (isStart.value) {
      translate = props.modelValue ? Math.min(0, delta) : Math.min(drawerWidth.value, -(drawerWidth.value - delta))
    } else if (isEnd.value) {
      translate = props.modelValue ? Math.max(0, delta) : Math.max(-drawerWidth.value, drawerWidth.value + delta)
    }
  } else if (!props.modelValue) {
    translate = isStart.value ? -drawerWidth.value : drawerWidth.value
  }

  const transform = isStart.value
    ? `translateX(${translate}px)`
    : `translateX(${translate}px)`

  return {
    transform,
    top: computedTop.value,
    height: computedHeight.value
  }
})

function onTouchStart(e) {
  if (!props.swipeable) return
  const touchX = e.touches[0].clientX
  const fromEdge = isStart.value
    ? touchX <= props.swipeEdgeSize
    : touchX >= window.innerWidth - props.swipeEdgeSize

  if (props.modelValue || fromEdge) {
    isDragging.value = true
    startX.value = touchX
    currentX.value = touchX
    drawerWidth.value = drawerEl.value?.offsetWidth || 256
  }
}

function onTouchMove(e) {
  if (!isDragging.value) return
  currentX.value = e.touches[0].clientX
}

function onTouchEnd() {
  if (!isDragging.value) return
  const diff = currentX.value - startX.value
  isDragging.value = false

  if (isStart.value) {
    if (!props.modelValue && diff > props.swipeThreshold) {
      emits('update:model-value', true)
    } else if (props.modelValue && diff < -props.swipeThreshold) {
      emits('update:model-value', false)
    }
  } else if (isEnd.value) {
    if (!props.modelValue && diff < -props.swipeThreshold) {
      emits('update:model-value', true)
    } else if (props.modelValue && diff > props.swipeThreshold) {
      emits('update:model-value', false)
    }
  }
}

const close = () => {
  if (!props.persistent) emits('update:model-value', false)
}

onBeforeUnmount(() => {
  isDragging.value = false
})
</script>
