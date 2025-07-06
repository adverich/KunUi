<template>
  <Teleport v-if="attach !== true" :to="attach || 'body'">
    <transition
      enter-active-class="transition ease-out duration-150"
      leave-active-class="transition ease-in duration-100"
      :enter-from-class="enterFromClass"
      :enter-to-class="enterToClass"
      :leave-from-class="leaveFromClass"
      :leave-to-class="leaveToClass"
    >
      <div 
        v-show="menuVisible" 
        ref="contentEl" 
        role="menu" 
        tabindex="-1"
        class="relative shadow-xl rounded-b overflow-y-auto focus:outline-none bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
        :class="[props.class, originClass, width, height, minWidth, maxWidth, minHeight, maxHeight, zIndex]"
        :style="{ ...menuPositionStyle, maxHeight: computedMaxHeight }" 
        @keydown.escape.stop="handleEscape"
      >
        <slot />
      </div>
    </transition>
  </Teleport>

  <span ref="activatorEl" v-if="$slots.activator">
    <slot name="activator" />
  </span>
</template>

<script setup>
import { onMounted, onUnmounted, watch, nextTick, onBeforeUnmount, computed } from 'vue'
import { useKunMenu } from '../composables/useKunMenu'
import { kunMenuProps } from '../composables/kunMenuProps'
import { useKunMenuStyles } from '../composables/useKunMenuStyles'
import { useKunMenuComposable } from '../composables/useKunMenuComposable'

const props = defineProps(kunMenuProps)
const emits = defineEmits(['update:modelValue', 'click:outside', 'handleEscape'])

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
    hideMenu()
    emits('click:outside')
  },
  [props.parentRef?.$el]
)

onMounted(() => {
  nextTick(() => {
    initializeMenu()
    window.addEventListener('resize', repositionMenu)
  })
})

onUnmounted(() => {
  const el = contentEl.value
  if (el) {
    el.removeEventListener('wheel', preventBodyScrollWhenAtEdge)
  }
  window.removeEventListener('resize', repositionMenu)
})

watch(menuVisible, (visible) => {
  const el = contentEl.value
  if (!el) return

  if (visible) {
    repositionMenu()
    el.addEventListener('wheel', preventBodyScrollWhenAtEdge, { passive: false });
    addEventListeners();
  } else {
    el.removeEventListener('wheel', preventBodyScrollWhenAtEdge)
    removeEventListeners();
  }
})

function preventBodyScrollWhenAtEdge(e) {
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
  const el = props.parentRef?.$el
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
</script>
