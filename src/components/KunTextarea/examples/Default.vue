<script setup lang="ts">
import KunTextarea from '../src/components/KunTextarea.vue';
</script>

<template>
  <div class="p-4 flex flex-col gap-y-4">
    <KunTextarea />

    <KunTextarea rows="1" auto-grow />
  </div>
</template>
