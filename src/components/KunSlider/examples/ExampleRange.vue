<template>
  <KunSlider
    v-model="rangeValue"
    :min="0"
    :max="100"
    :step="5"
    :range="true"
    label="Rango de valores"
  />
</template>

<script setup>
import KunSlider from '../src/components/KunSlider.vue'
import { ref } from 'vue'

const rangeValue = ref([20, 80])
</script>
