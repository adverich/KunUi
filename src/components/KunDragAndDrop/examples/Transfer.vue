<script setup>
import { ref } from 'vue'
import KunDragAndDrop from '../src/components/KunDragAndDrop.vue'

const todo = ref([
  { id: 'a', title: 'Schedule perm' },
  { id: 'b', title: 'Rewind VHS tapes' },
  { id: 'c', title: 'Learn C++' },
])
const done = ref([{ id: 'd', title: 'Pickup mix-tape' }])
</script>

<template>
  <div class="p-4 space-y-4">
    <h2 class="text-lg font-medium">Transfer entre listas</h2>
    <p class="text-sm text-ui-muted">Mismo <code>group</code> permite mover ítems entre columnas.</p>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <div class="text-sm font-medium mb-2">Todo</div>
        <KunDragAndDrop v-model="todo" group="kanban" class="min-h-40 p-2 rounded-lg border border-surface" />
      </div>
      <div>
        <div class="text-sm font-medium mb-2">Done</div>
        <KunDragAndDrop v-model="done" group="kanban" class="min-h-40 p-2 rounded-lg border border-surface" />
      </div>
    </div>
  </div>
</template>
