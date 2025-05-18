<template>
  <!-- Teleport content if not attached to self -->
  <Teleport v-if="attach !== true" :to="attach || 'body'">
    <component
      :is="transitionComponent"
      v-if="typeof props.transition === 'object'"
      mode="out-in"
    >
      <div
        v-show="menuVisible"
        ref="contentEl"
        role="menu"
        :aria-label="label"
        tabindex="-1"
        class="absolute bg-white dark:bg-gray-800 rounded shadow-lg z-[var(--zIndex,2000)] overflow-hidden focus:outline-none"
        :class="[
          contentClass,
          locationMap[location]?.class || ''
        ]"
        :style="{
          width: menuWidth,
          minWidth: computedMinWidth,
          maxWidth: computedMaxWidth,
          minHeight: computedMinHeight,
          maxHeight: computedMaxHeight,
          height: computedHeight,
          zIndex,
          opacity: scrim && typeof scrim === 'string' ? props.opacity : undefined
        }"
        v-bind="contentProps"
        @click.stop="handleContentClick"
        @keydown.down.stop.prevent="focusNextItem"
        @keydown.up.stop.prevent="focusPrevItem"
        @keydown.enter.stop="focusCurrentItem"
        @keydown.escape="hideMenu"
      >
        <div class="max-h-60 overflow-auto">
          <slot />
        </div>
      </div>
    </component>

    <transition v-else :name="computedTransition">
      <div
        v-show="menuVisible"
        ref="contentEl"
        role="menu"
        :aria-label="label"
        tabindex="-1"
        class="absolute bg-white dark:bg-gray-800 rounded shadow-lg z-[var(--zIndex,2000)] overflow-hidden focus:outline-none"
        :class="[
          contentClass,
          locationMap[location]?.class || ''
        ]"
        :style="{
          width: menuWidth,
          minWidth: computedMinWidth,
          maxWidth: computedMaxWidth,
          minHeight: computedMinHeight,
          maxHeight: computedMaxHeight,
          height: computedHeight,
          zIndex,
          opacity: scrim && typeof scrim === 'string' ? props.opacity : undefined
        }"
        v-bind="contentProps"
        @click.stop="handleContentClick"
        @keydown.down.stop.prevent="focusNextItem"
        @keydown.up.stop.prevent="focusPrevItem"
        @keydown.enter.stop="focusCurrentItem"
        @keydown.escape="hideMenu"
      >
        <div class="max-h-60 overflow-auto">
          <slot />
        </div>
      </div>
    </transition>
  </Teleport>

  <!-- Activator -->
  <div
    ref="activatorEl"
    class="inline-block relative"
    :class="[activatorProps.class]"
    :style="[activatorProps.style]"
    @click.stop="handleActivatorClick"
    @mouseenter="handleHover('enter')"
    @mouseleave="handleHover('leave')"
    @focus="handleFocus"
    role="button"
    :aria-haspopup="true"
    :aria-expanded="menuVisible"
    tabindex="0"
  >
    <slot name="activator" v-bind="{ isActive: menuVisible }" />
  </div>
</template>

<script setup>
import { useKunMenu } from '../composables/useKunMenu';
import { kunMenuProps } from '../composables/kunMenuProps';

const props = defineProps(kunMenuProps)
const emit = defineEmits(['update:modelValue'])

const {
  menuVisible,
  activatorEl,
  contentEl,
  computedWidth,
  computedHeight,
  computedMinWidth,
  computedMinHeight,
  computedMaxWidth,
  computedMaxHeight,
  locationMap,
  transitionComponent,
  showMenu,
  hideMenu,
  toggleMenu,
  handleActivatorClick,
  handleHover,
  handleFocus,
  handleContentClick,
  positionMenu,
  focusNextItem,
  focusPrevItem,
  focusCurrentItem,
  computedTransition,
  menuWidth
} = useKunMenu(props, emit)
</script>

<style scope>
/* Slide Y - Abre hacia abajo/arriba */
.slide-y-enter-active,
.slide-y-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.slide-y-enter-from,
.slide-y-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Slide X - Izquierda/Derecha */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(-10px);
  opacity: 0;
}

/* Escala + Fade (ideal para submenús) */
.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s ease;
  transform-origin: top left;
}
.scale-enter-from,
.scale-leave-to {
  transform: scale(0.92);
  opacity: 0;
}
</style>