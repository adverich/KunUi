<script setup>
import { ref } from 'vue'
import KunDragAndDrop from '../src/components/KunDragAndDrop.vue'

const items = ref([
  { id: 1, title: 'Depeche Mode' },
  { id: 2, title: 'Duran Duran' },
  { id: 3, title: 'Pet Shop Boys' },
  { id: 4, title: 'Kraftwerk' },
  { id: 5, title: 'Tears for Fears' },
])
</script>

<template>
  <div class="p-4 max-w-md space-y-3">
    <h2 class="text-lg font-medium">Lista sortable</h2>
    <p class="text-sm text-ui-muted">Arrastrá los ítems para reordenar (data-first).</p>
    <KunDragAndDrop v-model="items" />
    <pre class="text-xs opacity-70 overflow-auto">{{ items.map((i) => i.title).join(' → ') }}</pre>
  </div>
</template>
