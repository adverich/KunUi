<template>
  <div
    :class="[
      'kun-slider',
      vertical ? 'flex flex-col items-center h-64' : 'w-full',
      { 'opacity-60 cursor-not-allowed': disabled },
      props.class
    ]"
  >
    <div v-if="label" class="mb-2 text-sm font-medium text-gray-800 dark:text-gray-200">
      <slot name="label">{{ label }}</slot>
    </div>

    <div class="flex items-center w-full" :class="vertical ? 'flex-col' : 'flex-row'">
      <slot name="prepend" />

      <!-- Track -->
      <div
        ref="trackRef"
        :class="[
          'relative select-none cursor-pointer',
          vertical ? 'w-2 h-full' : 'h-1.5 w-full',
          'bg-gray-300 rounded-full'
        ]"
        @pointerdown="onTrackClick"
      >
        <!-- Track Fill -->
        <!-- <div
          class="absolute rounded-full z-10"
          :class="trackColor"
          :style="trackFillStyle"
          style="transition: all 150ms ease;"
        /> -->

        <!-- Ticks and Labels -->
        <div
          v-if="step > 0"
          class="absolute inset-0 flex px-1"
          :class="vertical ? 'flex-col justify-between' : 'justify-between items-center'"
        >
          <div
            v-for="(label, i) in tickCount"
            :key="i"
            class="h-1/2 flex flex-col items-center justify-center relative bg-red-700"
          >
            <!-- Invisible clickable area, no modifica el layout -->
            <div
              class="absolute z-20"
              :style="{
                width: vertical ? '0px' : '1px',
                height: vertical ? '4px' : '20px',
                top: vertical ? '-0px' : '-8px',
                left: vertical ? '0px' : '0px',
                cursor: 'pointer'
              }"
              @click.stop="() => onTickClick(i)"
            />

            <!-- Visible tick -->
            <div
              v-if="ticks"
              class="pointer-events-none"
              :class="tickColor"
              :style="{
                width: vertical ? '100%' : `${tickSize}px`,
                height: vertical ? `${tickSize}px` : '100%'
              }"
            />

            <!-- Optional label -->
            <span
              v-if="tickLabels"
              class="text-xs mt-1 select-none"
              :style="{ transform: vertical ? 'none' : 'translateY(8px)' }"
            >
              {{ min + step * i }}
            </span>
          </div>
        </div>

        <!-- Thumbs -->
        <template v-for="(style, i) in thumbStyles">
          <slot
            name="thumb"
            :index="i"
            :value="thumbs[i]"
            :style="style"
            :thumbColor="thumbColor"
            :thumbLabel="thumbLabel"
            :min="min"
            :max="max"
          >
            <KunThumb
              :key="i"
              :value="thumbs[i]"
              :thumbStyle="style"
              :thumbLabel="thumbLabel"
              :thumbColor="thumbColor"
              :min="min"
              :max="max"
              @pointerdown="e => onPointerDown(e, i)"
              @update="(val) => { const next = [...thumbs]; next[i] = val; emit('update:modelValue', props.range ? next : next[0]) }"
            />
          </slot>
        </template>
      </div>

      <slot name="append" />
    </div>

    <div class="flex justify-between text-xs text-gray-500 mt-1 w-full">
      <span>{{ min }}</span>
      <span>{{ max }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { KunSliderProps } from '../composables/KunSliderProps'
import { useSlider } from '../composables/useSlider'
import { useSliderInteractions } from '../composables/useSliderInteractions'
import KunThumb from './KunThumb.vue'

const emit = defineEmits(['update:modelValue', 'input', 'change'])
const props = defineProps(KunSliderProps);

const trackRef = ref(null)

const {
  val,
  updateValue,
  thumbStyles,
  trackFillStyle,
  tickCount
} = useSlider(props, emit, trackRef)

const thumbs = computed(() => (Array.isArray(val.value) ? [...val.value] : [val.value]))

const { onPointerDown, onTrackClick, onTickClick } = useSliderInteractions({
  trackRef,
  thumbs,
  props,
  emit
})
</script>

<style scoped>
body {
  user-select: none;
}
</style>