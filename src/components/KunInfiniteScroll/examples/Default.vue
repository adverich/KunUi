<template>
  <div class="p-4 space-y-6">
    <div class="flex items-center gap-4">
      <button
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        @click="useVirtual = !useVirtual"
      >
        Toggle Virtual Scroll ({{ useVirtual ? 'ON' : 'OFF' }})
      </button>

      <button
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        @click="scrollTo(50)"
      >
        Scroll to Item #50
      </button>
    </div>

    <KunInfiniteScroll
      :items="allItems"
      :search="search"
      :searchable-keys="['label']"
      :items-per-intersection="20"
      :enabled="true"
      :virtual="useVirtual"
      :scroll-to-index="scrollTarget"
      @update:items="visibleItems = $event"
    >
      <template #default="{ item, index }">
        <div
          class="border-b border-gray-200 py-2 px-4"
          :style="{ height: index % 2 === 0 ? '40px' : '60px' }"
        >
          <strong>#{{ index }}</strong> — {{ item.label }}
        </div>
      </template>
    </KunInfiniteScroll>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import KunInfiniteScroll from '../src/components/KunInfiniteScroll.vue'

const search = ref('')
const useVirtual = ref(true)
const scrollTarget = ref(null)
const visibleItems = ref([])

const allItems = ref(
  Array.from({ length: 200 }, (_, i) => ({
    id: i,
    label: `Elemento ${i}`,
  }))
)

function scrollTo(index) {
  scrollTarget.value = index
  // Se reinicia automáticamente si el prop es reactivo (puede resetear a null si hace falta repetir)
}
</script>
