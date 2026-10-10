<script setup lang="ts">
import { ref } from 'vue';
import KunSelect from '../src/components/KunSelect.vue';

const selected = ref(null);
const items = ref([
  { id: 1, name: 'Opción 1' },
  { id: 2, name: 'Opción 2' },
  { id: 3, name: 'Opción 3', disabled: true },
]);
</script>

<template>
  <div class="p-4 flex flex-col gap-4">
    <KunSelect
      v-model="selected"
      v-model:items="items"
      label="Seleccionar"
      item-value="id"
      item-title="name"
      clearable
    />
    <pre class="text-xs">selected: {{ selected }}</pre>
  </div>
</template>
