<script setup>
import { ref } from 'vue'
import KunDragAndDrop from '../src/components/KunDragAndDrop.vue'
import KunDragAndDropItem from '../../KunDragAndDropItem/src/components/KunDragAndDropItem.vue'

const modules = ref([
  { id: 1, title: 'Ventas' },
  { id: 2, title: 'Compras' },
  { id: 3, title: 'Stock' },
  { id: 4, title: 'Reportes' },
  { id: 5, title: 'Clientes' },
  { id: 6, title: 'Caja' },
])
</script>

<template>
  <div class="p-4 space-y-3">
    <h2 class="text-lg font-medium">Layout grid</h2>
    <p class="text-sm text-ui-muted">El orden sigue el array; <code>layout="grid"</code> solo afecta CSS.</p>
    <KunDragAndDrop v-model="modules" layout="grid">
      <template #item="{ item, index }">
        <KunDragAndDropItem
          :item="item"
          :index="index"
          :item-key="item.id"
          class="rounded-xl border border-surface bg-surface-light p-4 text-center shadow-sm"
        >
          <div class="text-xs opacity-50 mb-1">#{{ index + 1 }}</div>
          <div class="font-medium truncate">{{ item.title }}</div>
        </KunDragAndDropItem>
      </template>
    </KunDragAndDrop>
  </div>
</template>
