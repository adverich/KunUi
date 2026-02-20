<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useIntersectionObserver } from '../composables/useIntersectionObserver'
import { useKunInfiniteScroll } from '../composables/useKunInfiniteScroll'
import { kunInfiniteScrollProps } from '../composables/kunInfiniteScrollProps'
import KunVirtualScroller from '../../../KunVirtualScroller/src/components/KunVirtualScroller.vue'

const props = defineProps(kunInfiniteScrollProps)

const emit = defineEmits(['update:items'])

const sentinel = ref(null)
const scrollContainer = ref(null)

const {
  visibleItems,
  loadNextBatch,
  resetCurrentBatchStep,
  lastBatchReached,
  isFirstBatch,
  totalItems,
  setScrollToIndex
} = useKunInfiniteScroll({
  items: computed(() => props.items),
  search: computed(() => props.search),
  searchableKeys: props.searchableKeys,
  itemsPerIntersection: props.itemsPerIntersection,
})


onMounted(() => {
  useIntersectionObserver(sentinel.value, ([entry]) => {
    if (entry.isIntersecting) {
      // Verificamos si aún hay elementos que cargar
      if (!lastBatchReached.value) {
        loadNextBatch();
      }
    }
  });
});
</script>

<template>
  <div class="w-full h-full overflow-auto" ref="scrollContainer">
      <component
          v-if="virtual"
          :is="KunVirtualScroller"
          :items="visibleItems.length ? visibleItems : [{}]"
          :estimated-item-height="itemSize"
          :scroll-to-index="scrollToIndex"
          class="virtual-list"
      >
        <template #default="{ item, index }">
          <slot
            :item="item"
            :index="index"
            :empty="visibleItems.length === 0"
          />
        </template>
      </component>

    <template v-else>
      <template v-if="visibleItems.length">
        <template v-for="(item, index) in visibleItems" :key="item.id ?? index">
          <slot :item="item" :index="index" :visible-items="visibleItems" />
        </template>
      </template>
      <template v-else>
        <slot :visible-items="visibleItems" />
      </template>
    </template>
    <div ref="sentinel" class="w-full h-1" />
  </div>
</template>

<style scoped>
.virtual-list {
  max-height: 100%;
  overflow-y: auto;
}
</style>
