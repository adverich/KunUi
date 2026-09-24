<script setup>
import { ref } from 'vue'
import KunDragAndDrop from '../src/components/KunDragAndDrop.vue'
import KunDragAndDropItem from '../../KunDragAndDropItem/src/components/KunDragAndDropItem.vue'
import KunDragAndDropHandle from '../../KunDragAndDropHandle/src/components/KunDragAndDropHandle.vue'

const items = ref([
  { id: 1, title: 'Solo desde el handle' },
  { id: 2, title: 'Los botones no arrastran' },
  { id: 3, title: '⋮⋮ es el agarre' },
])

function onAction(title) {
  console.log('action', title)
}
</script>

<template>
  <div class="p-4 max-w-lg space-y-3">
    <h2 class="text-lg font-medium">Drag handle</h2>
    <p class="text-sm text-ui-muted">
      Con <code>drag-handle="[data-kun-dnd-handle]"</code> solo se inicia el drag desde el agarre.
    </p>
    <KunDragAndDrop v-model="items" drag-handle="[data-kun-dnd-handle]">
      <template #item="{ item, index }">
        <KunDragAndDropItem
          :item="item"
          :index="index"
          :item-key="item.id"
          class="rounded-lg border border-surface bg-surface-light px-3 py-2"
        >
          <div class="flex items-center gap-2">
            <KunDragAndDropHandle />
            <span class="flex-1 truncate">{{ item.title }}</span>
            <button
              type="button"
              class="text-xs px-2 py-1 rounded bg-button"
              data-no-drag
              @click="onAction(item.title)"
            >
              Acción
            </button>
          </div>
        </KunDragAndDropItem>
      </template>
    </KunDragAndDrop>
  </div>
</template>
