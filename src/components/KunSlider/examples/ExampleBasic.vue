<template>
  <KunSlider v-model="value" :min="0" :max="100" label="Básico" />
</template>

<script setup>
import KunSlider from '../KunSlider.vue'
import { ref } from 'vue'

const value = ref(50)
</script>
