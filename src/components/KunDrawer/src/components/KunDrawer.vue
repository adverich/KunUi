<template>
  <!-- Drawer -->
  <component
    v-show="modelValue || permanent || isDragging"
    :is="tag"
    ref="drawerEl"
    class="z-[2001] flex flex-col select-none will-change-transform"
    :class="[
      computedClass,
      absolute ? 'absolute' : 'fixed',
      floating ? 'border-none' : '',
      isDragging ? 'transition-none' : swipeTransition,
      'touch-pan-y'
    ]"
    :style="drawerStyle"
    @click.stop
    @touchstart.passive="onTouchStart"
    @touchmove="onTouchMove"
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
      class="fixed inset-0 bg-black"
      :style="{ opacity: 0.4 * (1 - openProgress) }"
      @click="close"
    />
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useAppbarHeight } from '@/utils/useLayout'

/* Emits */
const emits = defineEmits([
  'update:model-value',
  'update:modelValue',
  'swipe-start',
  'swipe-move',
  'swipe-end'
])
function emitModel(val) {
  emits('update:model-value', val)
  emits('update:modelValue', val)
}

const props = defineProps({
  modelValue: Boolean,
  absolute: Boolean,
  border: [Boolean, String, Number],
  color: String,
  elevation: [String, Number],
  floating: Boolean,
  image: String,
  location: { type: String, default: 'start' },
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

  /* Swipe */
  swipeable: { type: Boolean, default: false },
  swipeThreshold: { type: Number, default: 50 },
  swipeEdgeSize: { type: Number, default: 30 },
  swipeTransition: { type: String, default: 'transition-transform duration-300 ease-in-out' },

  swipeHandleSize: { type: Number, default: 24 },
  swipeMinVelocity: { type: Number, default: 0.35 },
  scrimTransition: { type: String, default: 'opacity 200ms ease' },

  animationDuration: { type: Number, default: 300 },
  animationEasing: { type: String, default: 'ease-in-out' },

  /* Nuevo */
  peekSize: { type: Number, default: 0 } // borde visible cuando está cerrado
})

/* Layout */
const appbarHeight = useAppbarHeight()
const drawerEl = ref(null)
const drawerWidth = ref(256)
let drawerWidthCached = 256

function measureDrawerWidth() {
  drawerWidthCached = drawerEl.value?.offsetWidth || drawerWidthCached
  drawerWidth.value = drawerWidthCached
}

/* Computed base */
const computedTop = computed(() => props.fullHeight ? '0px' : `${appbarHeight.value}px`)
const computedHeight = computed(() =>
  props.fullHeight
    ? (typeof window !== 'undefined' && window.innerWidth < 768 ? '100dvh' : '100vh')
    : `calc(100vh - ${appbarHeight.value}px)`
)
const widthClass = computed(() => props.rail ? props.railWidth : props.width)
const isStart = computed(() => ['start', 'left'].includes(props.location))
const isEnd = computed(() => ['end', 'right'].includes(props.location))

/* Classes */
const positionClass = computed(() => {
  switch (props.location) {
    case 'start':
    case 'left': return 'left-0 top-0 h-full'
    case 'end':
    case 'right': return 'right-0 top-0 h-full'
    case 'top': return 'top-0 left-0 w-full'
    case 'bottom': return 'bottom-0 left-0 w-full'
    default: return 'left-0 top-0 h-full'
  }
})
const borderClass = computed(() => {
  if (!props.border) return ''
  if (typeof props.border === 'string') return `border-${props.border}`
  return 'border'
})
const roundedClass = computed(() => {
  if (props.rounded === true) return isStart.value ? 'rounded-r' : 'rounded-l'
  if (typeof props.rounded === 'string') return props.rounded
  if (typeof props.rounded === 'number') return `rounded-[${props.rounded}px]`
  return ''
})
const computedClass = computed(() => ([
  positionClass.value,
  widthClass.value,
  borderClass.value,
  props.elevation ? `shadow-${props.elevation}` : '',
  roundedClass.value,
  props.color ?? 'bg-surface-dark',
  props.scrollable ? 'overflow-auto' : ''
]))

/* Drag state */
const startX = ref(0)
const currentX = ref(0)
const isDragging = ref(false)
let lastMoveTs = 0
let lastMoveX = 0
let velocity = 0

/* Progress */
const openProgress = computed(() => {
  const t = getTranslate()
  const w = drawerWidth.value || 1
  return Math.min(1, Math.max(0, 1 - Math.abs(t) / w))
})

/* Translate calculation */
function getClosedTranslate() {
  const peek = isDragging.value ? 0 : props.peekSize
  return isStart.value
    ? -drawerWidth.value + peek
    : drawerWidth.value - peek
}

function getOpenTranslate() {
  return 0
}

function getTranslate() {
  if (!props.swipeable) {
    return props.modelValue ? getOpenTranslate() : getClosedTranslate()
  }
  if (isDragging.value) {
    const delta = currentX.value - startX.value
    if (props.modelValue) {
      return isStart.value ? Math.min(0, delta) : Math.max(0, delta)
    } else {
      return isStart.value
        ? Math.min(drawerWidth.value, getClosedTranslate() + delta)
        : Math.max(-drawerWidth.value, getClosedTranslate() + delta)
    }
  }
  return props.modelValue ? getOpenTranslate() : getClosedTranslate()
}

const drawerStyle = computed(() => {
  let duration = props.animationDuration
  if (!isDragging.value) {
    const remaining = drawerWidth.value * (1 - openProgress.value)
    duration = Math.max(120, Math.min(300, remaining * 1.2))
  }
  return {
    transform: `translateX(${getTranslate()}px)`,
    top: computedTop.value,
    height: computedHeight.value,
    transition: isDragging.value
      ? 'none'
      : `transform ${duration}ms ${props.animationEasing}`
  }
})

/* Helpers */
function getClientX(e) {
  if (e?.touches?.length) return e.touches[0].clientX
  if (e?.changedTouches?.length) return e.changedTouches[0].clientX
  return e.clientX
}
function isInteractiveTarget(el) {
  const selector = 'input,textarea,select,button,a,[role="button"],[data-no-drag]'
  return !!el && el.closest?.(selector)
}

/* Drag core */
function beginDrag(x) {
  isDragging.value = true
  startX.value = x
  currentX.value = x
  lastMoveX = x
  lastMoveTs = performance.now()
  velocity = 0
  measureDrawerWidth()
  emits('swipe-start', { x, width: drawerWidth.value })
}

let dragRAF = null
function updateDrag(x) {
  if (dragRAF) cancelAnimationFrame(dragRAF)
  dragRAF = requestAnimationFrame(() => {
    const now = performance.now()
    const dx = x - lastMoveX
    const dt = Math.max(1, now - lastMoveTs)
    velocity = dx / dt
    lastMoveX = x
    lastMoveTs = now
    currentX.value = x
    emits('swipe-move', { x, progress: openProgress.value })
  })
}

function endDrag() {
  const diff = currentX.value - startX.value
  const v = velocity
  isDragging.value = false

  if (isStart.value) {
    if (!props.modelValue) {
      emitModel(diff > props.swipeThreshold || v > props.swipeMinVelocity)
    } else {
      emitModel(!(diff < -props.swipeThreshold || v < -props.swipeMinVelocity))
    }
  } else if (isEnd.value) {
    if (!props.modelValue) {
      emitModel(diff < -props.swipeThreshold || v < -props.swipeMinVelocity)
    } else {
      emitModel(!(diff > props.swipeThreshold || v > props.swipeMinVelocity))
    }
  }
  emits('swipe-end', { opened: props.modelValue })
}

/* Local touch listeners */
function onTouchStart(e) {
  if (!props.swipeable || isInteractiveTarget(e.target)) return
  const x = getClientX(e)
  nextTick(() => {
    measureDrawerWidth()

    // Si está abierto → detectar desde cualquier punto del drawer
    if (props.modelValue) {
      beginDrag(x)
      return
    }

    // Si está cerrado → solo detectar si viene desde el borde (handle)
    const handleHit = isStart.value
      ? x <= props.swipeEdgeSize
      : x >= window.innerWidth - props.swipeEdgeSize

    if (handleHit) beginDrag(x)
  })
}

function onTouchMove(e) {
  if (isDragging.value) {
    e.preventDefault() // evita scroll mientras arrastras
    updateDrag(getClientX(e))
  }
}
function onTouchEnd() {
  if (isDragging.value) endDrag()
}

/* Global pointer listeners */
function onPointerDownGlobal(e) {
  if (!props.swipeable || props.permanent || props.modelValue || isInteractiveTarget(e.target)) return
  const x = getClientX(e)
  const fromEdge = isStart.value ? x <= props.swipeEdgeSize : x >= window.innerWidth - props.swipeEdgeSize
  if (!fromEdge) return
  beginDrag(x)
}
function onPointerMoveGlobal(e) {
  if (isDragging.value) updateDrag(getClientX(e))
}
function onPointerUpGlobal() {
  if (isDragging.value) endDrag()
}

/* Close */
function close() {
  if (!props.persistent) emitModel(false)
}

/* Lifecycle */
onMounted(() => {
  measureDrawerWidth()
  if (props.swipeable) {
    window.addEventListener('pointerdown', onPointerDownGlobal, { passive: true })
    window.addEventListener('pointermove', onPointerMoveGlobal, { passive: true })
    window.addEventListener('pointerup', onPointerUpGlobal, { passive: true })
  }
})
onBeforeUnmount(() => {
  if (props.swipeable) {
    window.removeEventListener('pointerdown', onPointerDownGlobal)
    window.removeEventListener('pointermove', onPointerMoveGlobal)
    window.removeEventListener('pointerup', onPointerUpGlobal)
  }
  isDragging.value = false
})
watch(() => props.modelValue, () => { isDragging.value = false })
</script>
