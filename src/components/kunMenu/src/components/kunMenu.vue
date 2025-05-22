<template>
    <Teleport v-if="attach !== true" :to="attach || 'body'">
      <!-- <div
        v-if="typeof props.transition === 'object'"
        v-show="menuVisible"
        ref="contentEl"
        role="menu"
        :aria-label="label"
        tabindex="-1"
        class="absolute w-full rounded shadow-lg z-[var(--zIndex,2000)] overflow-hidden focus:outline-none"
        :class="[contentClass, originClass]"
        :style="{
          width: width,
          minWidth: minWidth,
          maxWidth: maxWidth,
          minHeight: minHeight,
          maxHeight: maxHeight,
          height: height,
          zIndex,
          menuPositionStyle
        }"
        v-bind="contentProps"
        @click.stop="handleClick"
        @keydown="emits('keydown')"
        @keydown.enter.stop="focusCurrentItem"
        @keydown.escape="hideMenu"
      >
        <slot />
      </div> -->

      <transition :name="transition">
        <div
          v-show="menuVisible"
          ref="contentEl"
          role="menu"
          tabindex="-1"
          class="bg-gray-100 rounded shadow-lg overflow-y-auto focus:outline-none mt-0.5"
          :class="[contentClass, originClass, width, height, minWidth, maxWidth, minHeight, maxHeight, zIndex]"
          :style="{
            ...menuPositionStyle,
            maxHeight: typeof maxHeight === 'number' ? maxHeight + 'px' : maxHeight
          }"
          v-bind="contentProps"
          @keydown.enter.stop="focusCurrentItem"
          @keydown.escape.stop="handleEscape"
        >
          <slot />
        </div>
      </transition>
    </Teleport>
</template>

<script setup>
import { onMounted } from 'vue'
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
  setMenuPosition
} = useKunMenuStyles(props, contentEl, activatorEl, handleActivatorClick, handleHover, handleFocus);

onMounted(() => {
  setMenuPosition();
  initMenu();
});
</script>

<style scoped>
/* Fade */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Slide-Y */
.slide-y-enter-active, .slide-y-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.slide-y-enter-from, .slide-y-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}

/* Slide-X */
.slide-x-enter-active, .slide-x-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.slide-x-enter-from, .slide-x-leave-to {
  transform: translateX(-8px);
  opacity: 0;
}

/* Scale */
.scale-enter-active, .scale-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
  transform-origin: top left;
}
.scale-enter-from, .scale-leave-to {
  transform: scale(0.92);
  opacity: 0;
}
</style>
