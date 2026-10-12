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

    <div class="grid grid-cols-2 gap-3 max-w-xl [&>*]:min-w-0">
      <KunTextField v-model="rootMargin" label="Root margin" density="compact" />
      <KunTextField v-model="itemSizeRaw" label="Item size (px, modo virtual)" density="compact" inputmode="numeric" />
    </div>

    <KunInfiniteScroll
      :items="allItems"
      :search="search"
      :searchable-keys="['label']"
      :items-per-intersection="20"
      :enabled="true"
      :virtual="useVirtual"
      :root-margin="rootMargin"
      :item-size="itemSizeProp"
      :scroll-to-index="scrollTarget"
      @update:items="visibleItems = $event"
    >
      <template #default="{ item, index }">
        <div
          class="border-b border-gray-200 py-2 px-4"
          :style="{ height: (index as number) % 2 === 0 ? '40px' : '60px' }"
        >
          <strong>#{{ index }}</strong> — {{ (item as any).label }}
        </div>
      </template>
    </KunInfiniteScroll>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type Ref } from 'vue'
import KunInfiniteScroll from '../src/components/KunInfiniteScroll.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

const search = ref('')
const useVirtual = ref(true)
const scrollTarget: Ref<number | null> = ref(null)
const visibleItems = ref([])

// ------------------------------------------------------------------
// Controles del playground
// ------------------------------------------------------------------
const rootMargin = ref('0px')
const itemSizeRaw = ref('48')
const itemSizeProp = computed(() => (itemSizeRaw.value === '' ? 48 : Number(itemSizeRaw.value)))

const allItems = ref(
  Array.from({ length: 200 }, (_, i) => ({
    id: i,
    label: `Elemento ${i}`,
  }))
)

function scrollTo(index: number): void {
  scrollTarget.value = index
  // Se reinicia automáticamente si el prop es reactivo (puede resetear a null si hace falta repetir)
}
</script>
