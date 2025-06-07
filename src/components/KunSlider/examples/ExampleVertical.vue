<template>
  <div class="flex gap-4">
    <KunSlider
      v-model="value"
      :min="0"
      :max="100"
      :vertical="true"
      label="Vertical"
      class="h-64"
    />
    <span class="self-end text-sm">{{ value }}</span>
  </div>
</template>

<script setup>
import KunSlider from '../KunSlider.vue'
import { ref } from 'vue'

const value = ref(70)
</script>
