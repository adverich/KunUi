<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { kunClockProps } from '../composables/kunClockProps'

const props = defineProps(kunClockProps);

const currentTime = ref('');
let intervalId = null;

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString([], { hour12: false });
};

onMounted(() => {
  updateTime();
  intervalId = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<template>
  <div 
    class="kun-clock"
    :style="{ 
      color: props.color, 
      fontSize: props.size,
    }"
  >
    {{ currentTime }}
  </div>
</template>

<style scoped>
.kun-clock {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 9999;
  font-family: monospace;
  background-color: transparent;
  pointer-events: none; /* Allows clicking through it */
}
</style>
