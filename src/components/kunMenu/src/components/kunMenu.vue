<template>
  <Teleport v-if="attach !== true" :to="attach || 'body'">
    <transition :name="transition">
      <div v-show="menuVisible" ref="contentEl" role="menu" tabindex="-1"
        class="relative shadow-xl rounded-b overflow-y-auto focus:outline-none bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
        :class="[contentClass, originClass, width, height, minWidth, maxWidth, minHeight, maxHeight, zIndex]"
        :style="{ ...menuPositionStyle, maxHeight: computedMaxHeight }" v-bind="contentProps"
        @keydown.escape.stop="handleEscape">
        <slot />
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted, watch, nextTick, onBeforeUnmount } from 'vue'
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
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-y-enter-active,
.slide-y-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.slide-y-enter-from,
.slide-y-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}

/* Scrollbar estilizado para todos los navegadores modernos */
div::-webkit-scrollbar {
  width: 8px;
}

div::-webkit-scrollbar-track {
  background: transparent;
}

div::-webkit-scrollbar-thumb {
  background-color: rgba(100, 116, 139, 0.5);
  /* gris semi-transparente */
  border-radius: 9999px;
  border: 2px solid transparent;
  background-clip: content-box;
}
</style>
