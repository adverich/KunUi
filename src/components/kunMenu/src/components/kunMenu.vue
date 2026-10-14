<template>
  <Teleport v-if="attach !== true && !contained" :to="attach || 'body'">
    <transition
      enter-active-class="transition ease-out duration-150"
      leave-active-class="transition ease-in duration-100"
      :enter-from-class="enterFromClass"
      :enter-to-class="enterToClass"
      :leave-from-class="leaveFromClass"
      :leave-to-class="leaveToClass"
    >
      <div 
        v-if="eager || menuVisible"
        v-show="menuVisible" 
        ref="contentEl" 
        role="menu"
        :aria-label="label"
        :tabindex="-1"
        class="relative shadow-xl rounded-b overflow-y-auto focus:outline-none border border-ui"
        :class="[(props.class as string), originClass, (width as string), (minWidth as string), (maxWidth as string), (minHeight as string), (height as string), (maxHeight as string), (zIndex as string), bgColor]"
        :style="contentStyle" 
        @click="handleContentClick"
        @keydown.escape.stop="handleEscape"
      >
        <slot />
      </div>
    </transition>
  </Teleport>
  <transition
    v-else
    enter-active-class="transition ease-out duration-150"
    leave-active-class="transition ease-in duration-100"
    :enter-from-class="enterFromClass"
    :enter-to-class="enterToClass"
    :leave-from-class="leaveFromClass"
    :leave-to-class="leaveToClass"
  >
    <div
      v-if="eager || menuVisible"
      v-show="menuVisible"
      ref="contentEl"
      role="menu"
      :aria-label="label"
      :tabindex="-1"
      class="relative shadow-xl rounded-b overflow-y-auto focus:outline-none border border-ui"
      :class="[(props.class as string), originClass, (width as string), (minWidth as string), (maxWidth as string), (minHeight as string), (height as string), (maxHeight as string), (zIndex as string), bgColor]"
      :style="contentStyle"
      @click="handleContentClick"
      @keydown.escape.stop="handleEscape"
    >
      <slot />
    </div>
  </transition>

  <span ref="activatorEl" v-if="$slots.activator" :aria-label="label">
    <slot name="activator" />
  </span>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, nextTick, onBeforeUnmount, computed, type Ref, type CSSProperties } from 'vue'
import { useKunMenu } from '../composables/useKunMenu.js'
import { kunMenuProps } from '../composables/kunMenuProps.js'
import { useKunMenuStyles } from '../composables/useKunMenuStyles.js'
import { useKunMenuComposable } from '../composables/useKunMenuComposable.js'

const props = defineProps(kunMenuProps)
const emits = defineEmits(['update:modelValue', 'click:outside', 'handleEscape'])

const parentEl: Ref<HTMLElement | null> = computed(() => {
  const p = props.parentRef as { $el?: HTMLElement; value?: HTMLElement } | HTMLElement | null | undefined
  if (!p) return null
  if (p instanceof HTMLElement) return p
  return p.$el ?? p.value ?? null
})

const {
  menuVisible,
  handleActivatorClick,
  handleHover,
  handleFocus,
  handleEscape,
  hideMenu
} = useKunMenu(props, emits)

const {
  initializeMenu,
  repositionMenu,
  resetMenuPosition,
  setAnchorName,
  clearAnchorName,
  startScrollTracking,
  stopScrollTracking,
  startContentTracking,
  stopContentTracking,
  contentEl,
  activatorEl,
  originClass,
  computedMaxHeight,
  menuPositionStyle,
} = useKunMenuStyles(props, handleActivatorClick, handleHover, handleFocus)

const { onClickOutside } = useKunMenuComposable()
const { addEventListeners, removeEventListeners } = onClickOutside(
  contentEl,
  () => {
    const activator = parentEl.value || activatorEl.value;
    const lastEvent = (window as unknown as { __lastClickEvent?: Event }).__lastClickEvent;

    if ((activator as HTMLElement | null)?.contains?.(lastEvent?.target as Node | null)) return;

    hideMenu()
    emits('click:outside')
  },
  props.parentRef ? [{ value: parentEl.value } as Ref<HTMLElement | null>] : []
)

onMounted(() => {
  nextTick(() => {
    initializeMenu()
    window.addEventListener('resize', handleMenuResize)
  })
})

function handleMenuResize(): void {
  repositionMenu()
}

function handleContentClick(): void {
  if (props.closeOnContentClick) hideMenu()
}

// Con el menú abierto, la rueda sobre el activador (ej. el KunTextField
// de un Autocomplete/Select) no debe scrollear la página: se anula el
// scroll de fondo y se reenvía al contenido del menú. Evita que el ancla
// se mueva bajo el cursor y el menú "persiga" al campo (efecto confuso).
let activatorWheelEl: HTMLElement | null = null

function forwardActivatorWheel(e: WheelEvent): void {
  const el = contentEl.value
  if (!el) return
  e.preventDefault()
  e.stopPropagation()
  if (e.deltaY) el.scrollTop += e.deltaY
  if (e.deltaX) el.scrollLeft += e.deltaX
}

function detachActivatorWheel(): void {
  if (activatorWheelEl) {
    activatorWheelEl.removeEventListener('wheel', forwardActivatorWheel)
    activatorWheelEl = null
  }
}

onUnmounted(() => {
  stopScrollTracking()
  stopContentTracking()
  clearAnchorName()
  detachActivatorWheel()
  const el = contentEl.value
  if (el) {
    el.removeEventListener('wheel', preventBodyScrollWhenAtEdge)
  }
  window.removeEventListener('resize', handleMenuResize)
})

watch(menuVisible, (visible) => {
  // Al cerrar, el contenido sigue montado en este punto (el `v-if` lo
  // desmonta en el patch posterior): la limpieza puede ser síncrona.
  if (!visible) {
    stopScrollTracking()
    stopContentTracking()
    detachActivatorWheel()
    const closedEl = contentEl.value
    if (closedEl) closedEl.removeEventListener('wheel', preventBodyScrollWhenAtEdge)
    removeEventListeners();
    resetMenuPosition()
    return
  }

  // Al abrir, el contenido (`v-if="eager || menuVisible"`) aún no está
  // montado cuando este watcher corre en pre-flush: `contentEl` es null y
  // posicionar ahí es un no-op que deja el menú sin `fixed` (bloque
  // estático al fondo del body). Se difiere al post-mount.
  nextTick(() => {
    const el = contentEl.value
    if (!el) return

    // Registra el `anchor-name` en el activador antes de posicionar (si el
    // navegador soporta anchors, `repositionMenu` usa el motor nativo).
    setAnchorName()
    repositionMenu()
    startScrollTracking(parentEl.value)
    startContentTracking()
    el.addEventListener('wheel', preventBodyScrollWhenAtEdge, { passive: false });
    detachActivatorWheel()
    const activator = parentEl.value
    if (activator instanceof HTMLElement) {
      activatorWheelEl = activator
      activatorWheelEl.addEventListener('wheel', forwardActivatorWheel, { passive: false });
    }
    addEventListeners();
  })
})

function preventBodyScrollWhenAtEdge(e: WheelEvent): void {
  const el = contentEl.value
  if (!el) return

  const isScrollingDown = e.deltaY > 0
  const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight
  const atTop = el.scrollTop <= 0

  if ((isScrollingDown && atBottom) || (!isScrollingDown && atTop)) {
    e.preventDefault()
  }
}

function cleanupActivatorListeners() {
  const el = parentEl.value
  if (el) {
    el.removeEventListener('click', handleActivatorClick)
    el.removeEventListener('mouseenter', () => handleHover('enter'))
    el.removeEventListener('mouseleave', () => handleHover('leave'))
    el.removeEventListener('focus', handleFocus)
  }
}

onBeforeUnmount(() => {
  cleanupActivatorListeners()
})

const enterFromClass = computed(() => {
  switch (props.transition) {
    case 'fade': return 'opacity-0';
    case 'fade-scale': return 'opacity-0 scale-95';
    case 'slide-down': return '-translate-y-2 opacity-0';
    case 'slide-up': return 'translate-y-2 opacity-0';
    case 'slide-left': return 'translate-x-2 opacity-0';
    case 'slide-right': return '-translate-x-2 opacity-0';
    default: return '';
  }
})

const enterToClass = computed(() => 'opacity-100 scale-100 translate-x-0 translate-y-0');
const leaveFromClass = enterToClass;
const leaveToClass = enterFromClass;

const contentStyle: Ref<CSSProperties> = computed(() => ({
  ...(menuPositionStyle.value as Record<string, string>),
  maxHeight: computedMaxHeight.value,
}));
</script>

