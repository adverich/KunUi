<template>
  <div class="p-4 space-y-3">
    <div class="grid grid-cols-2 gap-3 max-w-xl [&>*]:min-w-0">
      <KunTextField v-model="scrollToRaw" label="Scroll to index (vacío = null)" density="compact" inputmode="numeric" />
      <div class="flex items-end">
        <KunBtn text="Ir al índice" @click="goToIndex" />
      </div>
    </div>

    <div class="max-h-[400px] border overflow-y-auto">
      <KunVirtualScroller :items="items" :estimated-item-height="48" :buffer="5" :scroll-to-index="scrollToApplied">
        <template #default="{ item, index }">
          <div class="p-4 border-b bg-white">
            <strong>#{{ index }}</strong>: {{ (item as any).name }}
          </div>
        </template>
      </KunVirtualScroller>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import KunVirtualScroller from '../src/components/KunVirtualScroller.vue'
import KunBtn from '../../KunBtn/src/components/KunBtn.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

const items = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  name: `Item #${i}`
}))

// ------------------------------------------------------------------
// Controles del playground: scrollToIndex es Number | null
// ------------------------------------------------------------------
const scrollToRaw = ref('')
const scrollToParsed = computed<number | null>(() => {
  if (scrollToRaw.value.trim() === '' || Number.isNaN(Number(scrollToRaw.value))) return null
  return Number(scrollToRaw.value)
})
const scrollToApplied = ref<number | null>(null)

function goToIndex(): void {
  scrollToApplied.value = scrollToParsed.value
}
</script>
