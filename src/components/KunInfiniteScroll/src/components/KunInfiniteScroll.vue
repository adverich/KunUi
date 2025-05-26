<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useIntersectionObserver } from '../composables/useIntersectionObserver'
import { useKunInfiniteScroll } from '../composables/useKunInfiniteScroll'
import KunVirtualScroller from '../../../KunVirtualScroller/src/components/KunVirtualScroller.vue'

const props = defineProps({
  items: Array,
  search: String,
  searchableKeys: {
    type: Array,
    default: () => [],
  },
  itemsPerIntersection: {
    type: Number,
    default: 20,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  rootMargin: {
    type: String,
    default: '0px',
  },
  virtual: {
    type: Boolean,
    default: false,
  },
  itemSize: {
    type: Number,
    default: 48,
  },
  scrollToIndex: {
    type: Number,
    default: null,
  }
})

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
        :items="visibleItems"
        :estimated-item-height="itemSize"
        :scroll-to-index="scrollToIndex"
        class="virtual-list"
    >
        <template #default="{ item, index }">
            <slot :item="item" :index="index" />
        </template>
    </component>

    <template v-else>
      <template v-for="item in visibleItems">
        <slot :item="item" />
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
