<script setup>
import { ref, watch, computed, onMounted, nextTick } from 'vue'

const props = defineProps({
  items: Array, // paneles
  estimatedItemWidth: { type: Number, default: 300 },
  buffer: { type: Number, default: 2 },
  scrollToIndex: Number,
})

const containerRef = ref(null)
const scrollLeft = ref(0)
const containerWidth = ref(0)

const totalWidth = computed(() => props.items.length * props.estimatedItemWidth)

const startIndex = computed(() =>
  Math.max(0, Math.floor(scrollLeft.value / props.estimatedItemWidth) - props.buffer)
)

const endIndex = computed(() =>
  Math.min(
    props.items.length,
    Math.ceil((scrollLeft.value + containerWidth.value) / props.estimatedItemWidth) + props.buffer
  )
)

const visibleItems = computed(() =>
  props.items.slice(startIndex.value, endIndex.value)
)

const leftOffset = computed(() => startIndex.value * props.estimatedItemWidth)

function onScroll() {
  if (containerRef.value) scrollLeft.value = containerRef.value.scrollLeft
}

function updateContainerWidth() {
  if (containerRef.value) containerWidth.value = containerRef.value.clientWidth
}

watch(() => props.scrollToIndex, async (index) => {
  if (index != null && containerRef.value) {
    await nextTick()
    containerRef.value.scrollLeft = index * props.estimatedItemWidth
  }
})

onMounted(() => {
  updateContainerWidth()
  if (typeof ResizeObserver !== 'undefined') {
    const resizeObserver = new ResizeObserver(updateContainerWidth)
    resizeObserver.observe(containerRef.value)
  }
})
</script>

<template>
  <div ref="containerRef" class="w-full h-full overflow-x-auto relative" @scroll="onScroll">
    <div :style="{ width: totalWidth + 'px', position: 'relative', height: '100%' }">
      <div
        :style="{
          transform: `translateX(${leftOffset}px)`,
          position: 'absolute',
          height: '100%',
          display: 'flex',
        }"
      >
        <div
          v-for="(item, i) in visibleItems"
          :key="item?.[0]?.id ?? startIndex + i"
          class="w-[300px] h-full flex-shrink-0"
        >
          <slot :item="item" :index="startIndex + i" />
        </div>
      </div>
    </div>
  </div>
</template>
