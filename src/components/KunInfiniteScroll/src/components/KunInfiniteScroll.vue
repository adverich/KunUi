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


// El sentinel debe paginar contra el scroller real (ej. el KunMenu con
// overflow-y-auto), no contra el viewport: si el menú está limitado por
// max-height, los batches se cargan al scrollear el menú.
function findScrollRoot(el) {
  let p = el?.parentElement;
  while (p) {
    const oy = window.getComputedStyle(p).overflowY;
    if (oy === 'auto' || oy === 'scroll' || oy === 'overlay') return p;
    p = p.parentElement;
  }
  return null;
}

onMounted(() => {
  // Sin ancestro scrolleable (uso standalone): root null = viewport (comportamiento original).
  const root = findScrollRoot(sentinel.value) ?? null;
  useIntersectionObserver(sentinel.value, ([entry]) => {
    if (!props.enabled) return;
    if (entry.isIntersecting) {
      // Verificamos si aún hay elementos que cargar
      if (!lastBatchReached.value) {
        loadNextBatch();
      }
    }
  }, { root });
});
</script>

<template>
  <!-- Sin virtual: el scroll lo provee el ancestro (ej. KunMenu limitado por
    max-height). Un contenedor interno con h-full + overflow-auto nunca
    constriñe dentro de un padre de altura auto y genera doble scroll. -->
  <div v-if="virtual" class="w-full h-full overflow-auto" ref="scrollContainer">
      <component
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
    <div ref="sentinel" class="w-full h-1" />
  </div>
  <div v-else class="w-full" ref="scrollContainer">
      <template v-if="visibleItems.length">
        <template v-for="(item, index) in visibleItems" :key="item.id ?? index">
          <slot :item="item" :index="index" :visible-items="visibleItems" />
        </template>
      </template>
      <template v-else>
        <slot :visible-items="visibleItems" />
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
