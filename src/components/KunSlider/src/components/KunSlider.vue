<template>
  <div :class="['kun-slider', { 'kun-slider--disabled': disabled }, props.class]" :style="props.style">
    <div v-if="label" class="mb-2 text-sm font-medium text-gray-700">
      {{ label }}
    </div>

    <div class="relative flex items-center h-8">
      <input v-model.number="internalValue" type="range" :min="min" :max="max" :step="step" :disabled="disabled"
        class="w-full h-1 rounded-full appearance-none cursor-pointer bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        :class="{ 'cursor-not-allowed opacity-60': disabled }">

      <div v-if="thumbLabel && !disabled"
        class="absolute -top-7 left-0 w-8 h-8 flex items-center justify-center text-xs text-white bg-blue-500 rounded-full pointer-events-none origin-bottom"
        :style="{ transform: thumbPosition }">
        {{ internalValue }}
      </div>
    </div>

    <div class="flex justify-between text-xs text-gray-500 mt-1">
      <span>{{ min }}</span>
      <span>{{ max }}</span>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'
import { useSliderProps } from '../composables/useSliderProps'
import { useSlider } from '../composables/useSlider'

const emit = defineEmits(['update:modelValue'])
const props = defineProps(useSliderProps())

const { internalValue, thumbPosition } = useSlider(props, emit)
</script>

<style scoped>
.kun-slider--disabled input {
  @apply cursor-not-allowed opacity-60;
}
</style>