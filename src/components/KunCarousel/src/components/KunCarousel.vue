<template>
  <div :class="['kun-carousel relative w-full', (props.wrapperClass as string)]">
    <!-- Viewport -->
    <div
      ref="viewportRef"
      :tabindex="0"
      :class="[
        'kun-carousel__viewport overflow-hidden outline-none select-none',
        isVertical ? '' : 'w-full',
        axis === 'x' ? 'kun-carousel__viewport--x' : 'kun-carousel__viewport--y',
        isDragging ? 'cursor-grabbing' : 'cursor-grab',
        (props.viewportClass as string),
      ]"
      :style="viewportStyle"
      role="region"
      aria-roledescription="carousel"
      :aria-label="ariaLabel"
    >
      <!-- Container / track -->
      <div
        ref="containerRef"
        :class="[
          'kun-carousel__container flex will-change-transform',
          isVertical ? 'flex-col' : 'flex-row',
          (props.containerClass as string),
        ]"
        :style="containerStyle"
      >
        <slot />
      </div>
    </div>

    <!-- Flechas flotantes a los lados -->
    <template v-if="props.showArrows && props.arrowsPosition === 'sides'">
      <slot name="prev" :go-to-prev="handlePrev" :disabled="!canPrev" :can-go-to-prev="canPrev">
        <button
          type="button"
          :disabled="!canPrev"
          :class="[
            'kun-carousel__arrow kun-carousel__arrow--prev',
            'absolute top-1/2 -translate-y-1/2 left-2 z-10',
            'flex items-center justify-center w-9 h-9 rounded-full',
            'bg-surface-dark/80 text-ui border border-surface shadow-md cursor-pointer',
            'transition hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed',
            (props.arrowClass as string),
          ]"
          :aria-label="prevLabel"
          @click="handlePrev"
        >
          <svg
            v-if="!isVertical"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-5 h-5"
            :class="{ 'rotate-180': isRtl }"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-5 h-5"
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        </button>
      </slot>

      <slot name="next" :go-to-next="handleNext" :disabled="!canNext" :can-go-to-next="canNext">
        <button
          type="button"
          :disabled="!canNext"
          :class="[
            'kun-carousel__arrow kun-carousel__arrow--next',
            'absolute top-1/2 -translate-y-1/2 right-2 z-10',
            'flex items-center justify-center w-9 h-9 rounded-full',
            'bg-surface-dark/80 text-ui border border-surface shadow-md cursor-pointer',
            'transition hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed',
            (props.arrowClass as string),
          ]"
          :aria-label="nextLabel"
          @click="handleNext"
        >
          <svg
            v-if="!isVertical"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-5 h-5"
            :class="{ 'rotate-180': isRtl }"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-5 h-5"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </slot>
    </template>

    <!-- Barra inferior: flechas + dots -->
    <div
      v-if="(props.showArrows && props.arrowsPosition === 'bottom') || props.showDots"
      class="mt-3 flex items-center justify-center gap-3"
    >
      <slot
        v-if="props.showArrows && props.arrowsPosition === 'bottom'"
        name="prev"
        :go-to-prev="handlePrev"
        :disabled="!canPrev"
        :can-go-to-prev="canPrev"
      >
        <button
          type="button"
          :disabled="!canPrev"
          :class="[
            'kun-carousel__arrow kun-carousel__arrow--prev',
            'flex items-center justify-center w-8 h-8 rounded-full',
            'bg-surface-dark text-ui border border-surface cursor-pointer',
            'transition hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed',
            (props.arrowClass as string),
          ]"
          :aria-label="prevLabel"
          @click="handlePrev"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-4 h-4"
            :class="{ 'rotate-180': isRtl && !isVertical }"
          >
            <path v-if="!isVertical" d="m15 18-6-6 6-6" />
            <path v-else d="m18 15-6-6-6 6" />
          </svg>
        </button>
      </slot>

      <slot
        v-if="props.showDots"
        name="dots"
        :snaps="snaps"
        :selected-index="selectedIndex"
        :go-to="handleGoTo"
      >
        <div :class="['flex items-center gap-2', (props.dotsClass as string)]" role="tablist" aria-label="Slides">
          <button
            v-for="(_, i) in snaps"
            :key="i"
            type="button"
            role="tab"
            :aria-selected="i === selectedIndex"
            :aria-label="`Ir al slide ${i + 1}`"
            :class="[
              'h-2 rounded-full transition-all cursor-pointer',
              i === selectedIndex
                ? 'w-6 bg-primary'
                : 'w-2 bg-surface-light hover:bg-surface',
            ]"
            @click="handleGoTo(i)"
          />
        </div>
      </slot>

      <slot
        v-if="props.showArrows && props.arrowsPosition === 'bottom'"
        name="next"
        :go-to-next="handleNext"
        :disabled="!canNext"
        :can-go-to-next="canNext"
      >
        <button
          type="button"
          :disabled="!canNext"
          :class="[
            'kun-carousel__arrow kun-carousel__arrow--next',
            'flex items-center justify-center w-8 h-8 rounded-full',
            'bg-surface-dark text-ui border border-surface cursor-pointer',
            'transition hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed',
            (props.arrowClass as string),
          ]"
          :aria-label="nextLabel"
          @click="handleNext"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-4 h-4"
            :class="{ 'rotate-180': isRtl && !isVertical }"
          >
            <path v-if="!isVertical" d="m9 18 6-6-6-6" />
            <path v-else d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, provide, type Ref } from 'vue'
import { kunCarouselProps } from '../composables/kunCarouselProps.js'
import { useKunCarouselEngine } from '../composables/useKunCarouselEngine.js'
import { KUN_CAROUSEL_KEY } from '../composables/kunCarouselContext.js'

const props = defineProps({
  ...kunCarouselProps,
  ariaLabel: { type: String, default: 'Carrusel' },
  prevLabel: { type: String, default: 'Anterior' },
  nextLabel: { type: String, default: 'Siguiente' },
})

const emit = defineEmits([
  'update:modelValue',
  'select',
  'settle',
  'scroll',
  'reinit',
  'destroy',
  'pointerdown',
  'pointermove',
  'pointerup',
  'slidesinview',
  'slideschanged',
  'slidefocus',
  'autoplay:play',
  'autoplay:stop',
  'autoplay:interaction',
])

const viewportRef: Ref<HTMLElement | null> = ref(null)
const containerRef: Ref<HTMLElement | null> = ref(null)

const {
  api,
  selectedIndex,
  previousIndex,
  snaps,
  inView,
  scrollProgress,
  canPrev,
  canNext,
  isDragging,
  isSettled,
  didDrag,
  autoplayPlaying,
  effectiveOptions,
  reInit,
} = useKunCarouselEngine({ props, emit: emit as (...args: any[]) => void, viewportRef, containerRef })

// Contexto para el contenido (slides, grillas, cards): evita cablear
// refs a mano. Incluye el flag de drag para lógica de clicks.
provide(KUN_CAROUSEL_KEY, {
  api,
  didDrag,
  selectedIndex,
  isDragging,
  isSettled,
})

const isVertical = computed(() => effectiveOptions.value.axis === 'y')
const isRtl = computed(() => !isVertical.value && effectiveOptions.value.direction === 'rtl')

const viewportStyle = computed((): Record<string, string> => ({
  ...(isVertical.value ? { height: props.height as string } : {}),
  // direction CSS real: sin esto el flex sigue siendo LTR y la matemática
  // RTL (offsets desde el inicio de línea = borde derecho) no coincide
  direction: isRtl.value ? 'rtl' : 'ltr',
  touchAction: isVertical.value ? 'pan-x' : 'pan-y',
}))

const containerStyle = computed(() => ({
  '--kun-slide-size': props.slideSize,
  gap: props.gap,
}))

function userInteraction() {
  if (props.stopOnInteraction && props.autoplay) api.stop()
}

function handlePrev() {
  userInteraction()
  api.goToPrev()
}

function handleNext() {
  userInteraction()
  api.goToNext()
}

function handleGoTo(index: number): void {
  userInteraction()
  api.goTo(index)
}

defineExpose({
  // API estilo Embla v9
  goToNext: api.goToNext,
  goToPrev: api.goToPrev,
  goTo: api.goTo,
  canGoToNext: api.canGoToNext,
  canGoToPrev: api.canGoToPrev,
  selectedSnap: api.selectedSnap,
  previousSnap: api.previousSnap,
  snapList: api.snapList,
  snapIndex: api.snapIndex,
  scrollProgress: api.scrollProgress,
  slidesInView: api.slidesInView,
  slidesNotInView: api.slidesNotInView,
  reInit: api.reInit,
  destroy: api.destroy,
  rootNode: api.rootNode,
  containerNode: api.containerNode,
  slideNodes: api.slideNodes,
  play: api.play,
  stop: api.stop,
  // Alias v8
  scrollNext: api.scrollNext,
  scrollPrev: api.scrollPrev,
  scrollTo: api.scrollTo,
  canScrollNext: api.canScrollNext,
  canScrollPrev: api.canScrollPrev,
  selectedScrollSnap: api.selectedScrollSnap,
  previousScrollSnap: api.previousScrollSnap,
  scrollSnapList: api.scrollSnapList,
  // Estado reactivo
  selectedIndex,
  previousIndex,
  snaps,
  inView,
  progress: scrollProgress,
  canPrev,
  canNext,
  isDragging,
  isSettled,
  didDrag,
  autoplayPlaying,
  options: effectiveOptions,
})
</script>

<style>
.kun-carousel__viewport--x {
  overflow-x: hidden;
}

.kun-carousel__viewport--y {
  overflow-y: hidden;
}

.kun-carousel__container {
  position: relative;
  backface-visibility: hidden;
}

.kun-carousel__container > * {
  flex: 0 0 var(--kun-slide-size, 100%);
  min-width: 0;
  min-height: 0;
}

.kun-carousel__viewport img {
  -webkit-user-drag: none;
  user-select: none;
}
</style>

