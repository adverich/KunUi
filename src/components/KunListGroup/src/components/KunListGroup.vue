<template>
  <div class="kun-list-group" v-bind="$attrs">
    <!-- Activador -->
    <div
      class="kun-list-group__activator flex items-center justify-between cursor-pointer select-none"
      :class="{ 'opacity-50 pointer-events-none': disabled }"
      @click="!disabled && toggle()"
      role="button"
      :aria-expanded="modelValue"
      :aria-controls="contentId"
      :aria-disabled="disabled"
      tabindex="0"
      @keydown.enter="!disabled && toggle()"
      @keydown.space.prevent="!disabled && toggle()"
    >
      <slot name="activator">
        <div class="flex items-center gap-2">
          <span>{{ title }}</span>
        </div>
      </slot>
      <KunIcon
        :icon="modelValue ? expandIcon : collapseIcon"
        class="transition-transform duration-300"
        :class="{ 'rotate-180': modelValue }"
      />
    </div>

    <!-- Collapsible Content with auto height transition -->
    <div
      ref="contentRef"
      v-show="modelValue"
      class="kun-list-group__content pl-4 overflow-hidden transition-[height] duration-300 ease-in-out"
      :id="contentId"
      role="region"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import KunIcon from '../../../KunIcon/src/components/KunIcon.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  expandIcon: { type: String, default: '$mdi-chevron-up' },
  collapseIcon: { type: String, default: '$mdi-chevron-down' },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const contentRef = ref(null)
const height = ref(0)

const contentId = computed(() => `kun-list-group-content-${Math.random().toString(36).slice(2)}`)

const toggle = () => {
  emit('update:modelValue', !props.modelValue)
}

// Handle height transitions manually using ResizeObserver
let observerCleanup
const updateHeight = () => {
  if (!contentRef.value) return
  const el = contentRef.value
  el.style.height = 'auto'
  const fullHeight = `${el.scrollHeight}px`
  el.style.height = '0px' // reset before transition
  void el.offsetHeight // trigger reflow
  el.style.height = fullHeight
}

watch(() => props.modelValue, async (val) => {
  await nextTick()
  if (val) updateHeight()
  else if (contentRef.value) contentRef.value.style.height = '0px'
})

let resizeObserver = null

function observeResize(el, callback) {
  if (!el || typeof ResizeObserver === 'undefined') return

  resizeObserver = new ResizeObserver(() => {
    callback()
  })
  resizeObserver.observe(el)
}

function unobserveResize() {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
}

onMounted(() => {
  if (contentRef.value) {
    observeResize(contentRef.value, () => {
      if (props.modelValue) updateHeight()
    })
  }
})

onBeforeUnmount(() => {
  unobserveResize()
})
</script>
