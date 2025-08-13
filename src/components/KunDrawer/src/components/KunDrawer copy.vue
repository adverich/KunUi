<template>
  <!-- Drawer -->
  <component
    v-show="modelValue || permanent || isDragging"
    :is="tag"
    ref="drawerEl"
    class="fixed z-[2001] flex flex-col select-none will-change-transform"
    :class="[
      computedClass,
      absolute ? 'absolute' : 'fixed',
      floating ? 'border-none' : '',
      // cuando arrastro: sin transición; cuando suelto/aprieto: usa la transición configurable
      isDragging ? 'transition-none' : swipeTransition,
      // permite scroll vertical dentro, pero gestos horizontales del drawer
      'touch-pan-y'
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

  <!-- Scrim con opacidad progresiva -->
  <Transition name="kun-scrim">
    <div
      v-if="scrim && (modelValue || isDragging) && !permanent && !persistent"
      class="fixed inset-0 z-30"
      :style="{
        backgroundColor: `rgba(0,0,0,${0.4 * openProgress})`,
        transition: isDragging ? 'none' : scrimTransition
      }"
      @click="close"
    />
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useAppbarHeight } from '@/utils/useLayout'

/* 👇 compat v-model camel & kebab */
const emits = defineEmits(['update:model-value','update:modelValue'])
function emitModel (val) {
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
  location: { type: String, default: 'start' }, // start|end|left|right|top|bottom
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

  /* --- NUEVAS / ya tenías --- */
  swipeable: { type: Boolean, default: false },
  swipeThreshold: { type: Number, default: 50 },        // px para decidir apertura/cierre
  swipeEdgeSize: { type: Number, default: 30 },         // px desde el borde para iniciar si está cerrado
  swipeTransition: { type: String, default: 'transition-transform duration-300 ease-in-out' },

  /* --- extras (opcionales) --- */
  swipeHandleSize: { type: Number, default: 24 },       // zona interna para comenzar drag cuando está abierto
  swipeMinVelocity: { type: Number, default: 0.35 },    // px/ms para "flick" (abrir/cerrar aunque no llegue al threshold)
  scrimTransition: { type: String, default: 'opacity 200ms ease' }
})

const appbarHeight = useAppbarHeight();
const drawerEl = ref(null)

/* Posición y dimensiones */
const computedTop = computed(() =>
  props.fullHeight ? '0px' : `${appbarHeight.value}px`
)
const computedHeight = computed(() =>
  props.fullHeight
    ? (typeof window !== 'undefined' && window.innerWidth < 768 ? '100dvh' : '100vh')
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

const isStart = computed(() => ['start','left'].includes(props.location))
const isEnd   = computed(() => ['end','right'].includes(props.location))

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

/* --- Swipe handling --- */
const startX = ref(0)
const currentX = ref(0)
const isDragging = ref(false)
const drawerWidth = ref(0)
/* tracking para velocidad (flick) */
let lastMoveTs = 0
let lastMoveX = 0
let velocity = 0 // px/ms

/* progreso de apertura para scrim (0 cerrado, 1 abierto) */
const openProgress = computed(() => {
  // translate actual en px (negativo a la izquierda)
  const t = calcTranslateX()
  const w = drawerWidth.value || 1
  if (isStart.value) {
    // -w (cerrado) -> 0 (abierto)
    return Math.min(1, Math.max(0, 1 - Math.abs(t) / w))
  } else if (isEnd.value) {
    // w (cerrado) -> 0 (abierto)
    return Math.min(1, Math.max(0, 1 - Math.abs(t) / w))
  }
  return props.modelValue ? 1 : 0
})

/* Traducción actual (se usa en style y progreso) */
function calcTranslateX () {
  if (!props.swipeable) return props.modelValue ? 0 : (isStart.value ? - (drawerWidth.value || 0) : (drawerWidth.value || 0))

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
  return translate
}

const drawerStyle = computed(() => {
  const translate = calcTranslateX()
  return {
    transform: `translateX(${translate}px)`,
    top: computedTop.value,
    height: computedHeight.value
  }
})

/* Utils */
function getClientX (e) {
  if (e?.touches?.length) return e.touches[0].clientX
  if (e?.changedTouches?.length) return e.changedTouches[0].clientX
  return e.clientX
}

function isInteractiveTarget (el) {
  const selector = 'input,textarea,select,button,a,[role="button"],[data-no-drag]'
  return !!el && (el.closest?.(selector))
}

/* Listeners locales (cuando el drawer ya está capturando) */
function onTouchStart (e) {
  if (!props.swipeable) return
  if (!props.modelValue) return // cuando está cerrado, se usa el listener global de borde
  if (isInteractiveTarget(e.target)) return

  const x = getClientX(e)
  // restringir inicio a un handle interno para no interferir con contenido
  nextTick(() => {
    drawerWidth.value = drawerEl.value?.getBoundingClientRect?.().width || drawerWidth.value || 256
    const handleHit = isStart.value
      ? x >= drawerWidth.value - props.swipeHandleSize && x <= drawerWidth.value + 8
      : x <= window.innerWidth - (drawerWidth.value - props.swipeHandleSize) && x >= window.innerWidth - drawerWidth.value - 8
    if (!handleHit) return
    beginDrag(x)
  })
}

function onTouchMove (e) {
  if (!isDragging.value) return
  const x = getClientX(e)
  updateDrag(x)
}

function onTouchEnd () {
  if (!isDragging.value) return
  endDrag()
}

/* --- Global pointer para abrir desde el borde y funcionar en desktop --- */
function onPointerDownGlobal (e) {
  if (!props.swipeable || props.permanent) return
  // si está abierto, dejamos que los handlers locales decidan
  if (props.modelValue) return

  // ignorar clicks en elementos interactivos (p. ej. Swiper dentro, etc.)
  if (isInteractiveTarget(e.target)) return

  const x = getClientX(e)
  const fromEdge = isStart.value
    ? x <= props.swipeEdgeSize
    : x >= window.innerWidth - props.swipeEdgeSize

  if (!fromEdge) return

  // activamos el drawer para poder medir y arrastrar
  isDragging.value = true
  startX.value = x
  currentX.value = x
  lastMoveX = x
  lastMoveTs = performance.now()
  velocity = 0

  // v-show depende de isDragging → esperar a que esté en DOM y medir
  nextTick(() => {
    drawerWidth.value = drawerEl.value?.getBoundingClientRect?.().width || drawerWidth.value || 256
  })
}

function onPointerMoveGlobal (e) {
  if (!isDragging.value) return
  const x = getClientX(e)
  updateDrag(x)
}

function onPointerUpGlobal () {
  if (!isDragging.value) return
  endDrag()
}

/* Core drag helpers */
function beginDrag (x) {
  isDragging.value = true
  startX.value = x
  currentX.value = x
  lastMoveX = x
  lastMoveTs = performance.now()
  velocity = 0
  drawerWidth.value = drawerEl.value?.getBoundingClientRect?.().width || drawerWidth.value || 256
}

function updateDrag (x) {
  const now = performance.now()
  // velocidad en px/ms
  const dx = x - lastMoveX
  const dt = Math.max(1, now - lastMoveTs)
  velocity = dx / dt
  lastMoveX = x
  lastMoveTs = now
  currentX.value = x
}

function endDrag () {
  const diff = currentX.value - startX.value
  const v = velocity

  isDragging.value = false

  // Regla de decisión: flick o threshold
  if (isStart.value) {
    if (!props.modelValue) {
      if (diff > props.swipeThreshold || v > props.swipeMinVelocity) {
        emitModel(true)
      } else {
        emitModel(false)
      }
    } else {
      if (diff < -props.swipeThreshold || v < -props.swipeMinVelocity) {
        emitModel(false)
      } else {
        emitModel(true)
      }
    }
  } else if (isEnd.value) {
    if (!props.modelValue) {
      if (diff < -props.swipeThreshold || v < -props.swipeMinVelocity) {
        emitModel(true)
      } else {
        emitModel(false)
      }
    } else {
      if (diff > props.swipeThreshold || v > props.swipeMinVelocity) {
        emitModel(false)
      } else {
        emitModel(true)
      }
    }
  }
}

/* Close (respeta persistent) */
const close = () => {
  if (!props.persistent) emitModel(false)
}

/* listeners globales solo si swipeable */
onMounted(() => {
  if (!props.swipeable) return
  window.addEventListener('pointerdown', onPointerDownGlobal, { passive: true })
  window.addEventListener('pointermove', onPointerMoveGlobal, { passive: true })
  window.addEventListener('pointerup', onPointerUpGlobal, { passive: true })
})

onBeforeUnmount(() => {
  if (!props.swipeable) return
  window.removeEventListener('pointerdown', onPointerDownGlobal)
  window.removeEventListener('pointermove', onPointerMoveGlobal)
  window.removeEventListener('pointerup', onPointerUpGlobal)
  isDragging.value = false
})

/* Si el modelo cambia externamente, aborta cualquier drag residual */
watch(() => props.modelValue, () => {
  isDragging.value = false
})
</script>
