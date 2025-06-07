<template>
  <KunSlider v-model="value" label="Con Thumb personalizado">
    <template #thumb="{ value, style }">
      <div
        class="absolute z-40 w-6 h-6 flex items-center justify-center rounded-full bg-purple-600 text-white text-xs font-bold"
        :style="style"
      >
        🔥{{ value }}
      </div>
    </template>
  </KunSlider>
</template>

<script setup>
import KunSlider from '../KunSlider.vue'
import { ref } from 'vue'

const value = ref(42)
</script>
