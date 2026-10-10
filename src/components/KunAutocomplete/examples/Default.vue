<script setup lang="ts">
import KunAutocomplete from '../src/components/KunAutocomplete.vue';

const items = [
  { id: 1, name: 'Opción 1' },
  { id: 2, name: 'Opción 2' },
];
</script>

<template>
  <div class="p-4">
    <KunAutocomplete :items="items" item-title="name" label="Seleccionar" />
  </div>
</template>
