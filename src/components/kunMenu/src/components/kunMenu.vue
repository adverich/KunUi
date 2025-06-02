<template>
  <Teleport v-if="attach !== true" :to="attach || 'body'">
    <transition :name="transition">
      <div v-show="menuVisible" ref="contentEl" role="menu" tabindex="-1"
        class="rounded shadow-lg overflow-y-auto focus:outline-none mt-0.5 z-10"
        :class="[contentClass, originClass, width, height, minWidth, maxWidth, minHeight, maxHeight, zIndex]" 
        :style="{ ...menuPositionStyle, computedMaxHeight }" 
      v-bind="contentProps" @keydown.enter.stop="focusCurrentItem" @keydown.escape.stop="handleEscape">
        <slot />
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useKunMenu } from '../composables/useKunMenu'
import { kunMenuProps } from '../composables/kunMenuProps'
import { useKunMenuStyles } from '../composables/useKunMenuStyles'

const props = defineProps(kunMenuProps)
const emits = defineEmits(['update:modelValue', 'click:outside', 'handleEscape'])

const {
  menuVisible,
  activatorEl,
  contentEl,
  initMenu,
  handleActivatorClick,
  handleHover,
  handleFocus,
  focusCurrentItem,
  handleEscape
} = useKunMenu(props, emits)

const {
  originClass,
  setMenuPosition,
  updatePosition,
  computedMaxHeight,
  menuPositionStyle
} = useKunMenuStyles(props, contentEl, activatorEl, handleActivatorClick, handleHover, handleFocus);

onMounted(() => {
  setMenuPosition();
  updatePosition();
  initMenu();
  window.addEventListener('resize', updatePosition);
});

onUnmounted(() => {
  const el = contentEl.value;
  if (el) {
    el.removeEventListener('wheel', preventBodyScrollWhenAtEdge);
  }
  window.removeEventListener('resize', updatePosition);
});

watch(menuVisible, (visible) => {
  const el = contentEl.value;
  if (!el) return;

  if (visible) {
    updatePosition();

    el.addEventListener('wheel', preventBodyScrollWhenAtEdge, { passive: false });
  } else {
    el.removeEventListener('wheel', preventBodyScrollWhenAtEdge);
  }
});

function preventBodyScrollWhenAtEdge(e) {
  const el = contentEl.value;
  if (!el) return;

  const isScrollingDown = e.deltaY > 0;
  const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight;
  const atTop = el.scrollTop <= 0;

  // Si está al tope o al fondo, evitamos que el scroll pase al body
  if ((isScrollingDown && atBottom) || (!isScrollingDown && atTop)) {
    e.preventDefault();
  }
}
</script>

<style scoped>
/* Fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide-Y */
.slide-y-enter-active,
.slide-y-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.slide-y-enter-from,
.slide-y-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}

/* Slide-X */
.slide-x-enter-active,
.slide-x-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.slide-x-enter-from,
.slide-x-leave-to {
  transform: translateX(-8px);
  opacity: 0;
}

/* Scale */
.scale-enter-active,
.scale-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
  transform-origin: top left;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0.92);
  opacity: 0;
}
</style>
