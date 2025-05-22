<template>
  <div class="p-4 max-h-[400px] border overflow-y-auto">
    <KunVirtualScroller :items="items" item-height="auto" :buffer="5">
      <template #default="{ item, index }">
        <div class="p-4 border-b bg-white">
          <strong>#{{ index }}</strong>: {{ item.name }}
        </div>
      </template>
    </KunVirtualScroller>
  </div>
</template>

<script setup>
import KunVirtualScroller from '../src/components/KunVirtualScroller.vue'

const items = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  name: `Item #${i}`
}))
</script>
