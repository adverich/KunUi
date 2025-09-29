<script setup>
import { ref, watch, computed, onMounted, nextTick } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  estimatedItemHeight: {
    type: Number,
    default: 48,
  },
  buffer: {
    type: Number,
    default: 5,
  },
  scrollToIndex: {
    type: Number,
    default: null,
  },
})

const containerRef = ref(null)
const scrollTop = ref(0)
const containerHeight = ref(0)

const totalHeight = computed(() => props.items.length * props.estimatedItemHeight)

const startIndex = computed(() =>
  Math.max(0, Math.floor(scrollTop.value / props.estimatedItemHeight) - props.buffer)
)

const endIndex = computed(() =>
  Math.min(
    props.items.length,
    Math.ceil((scrollTop.value + containerHeight.value) / props.estimatedItemHeight) + props.buffer
  )
)

const visibleItems = computed(() =>
  props.items.slice(startIndex.value, endIndex.value)
)

const topOffset = computed(() => startIndex.value * props.estimatedItemHeight)

function onScroll() {
  if (containerRef.value) {
    scrollTop.value = containerRef.value.scrollTop
  }
}

function updateContainerHeight() {
  if (containerRef.value) {
    containerHeight.value = containerRef.value.clientHeight
  }
}

watch(
  () => props.scrollToIndex,
  async (index) => {
    if (
      index !== null &&
      typeof index === 'number' &&
      index >= 0 &&
      index < props.items.length &&
      containerRef.value
    ) {
      await nextTick()
      containerRef.value.scrollTop = index * props.estimatedItemHeight
    }
  },
  { immediate: true }
)

onMounted(() => {
  updateContainerHeight()
  if (typeof ResizeObserver !== 'undefined') {
    const resizeObserver = new ResizeObserver(updateContainerHeight)
    resizeObserver.observe(containerRef.value)
  }
})
</script>

<template>
  <div
    ref="containerRef"
    class="w-full h-full overflow-y-auto relative"
    @scroll="onScroll"
  >
    <div :style="{ height: totalHeight + 'px', position: 'relative' }">
      <div
        :style="{
          transform: `translateY(${topOffset}px)`,
          position: 'absolute',
          width: '100%',
        }"
      >
        <div
          v-for="(item, i) in visibleItems"
          :key="item?.id ?? startIndex + i"
        >
          <slot :item="item" :index="startIndex + i" />
        </div>
      </div>
    </div>
  </div>
</template>
