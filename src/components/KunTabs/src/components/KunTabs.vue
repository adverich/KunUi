<template>
  <div
    :class="[
      'relative w-full',
      direction === 'vertical' ? 'flex flex-col' : 'flex',
      bgColor,
    ]"
    :style="{ height: heightPx }"
    v-bind="$attrs"
  >
    <!-- Prev arrow -->
    <KunBtn
      v-if="showArrows && showPrev"
      :icon="prevIcon"
      variant="text"
      size="sm"
      @click="scrollPrev"
    />

    <!-- Tabs wrapper -->
    <div
      ref="tabsWrapper"
      :class="[
        'relative flex overflow-x-auto overflow-y-hidden whitespace-nowrap transition-all',
        direction === 'vertical' ? 'flex-col overflow-x-hidden' : 'flex-row horizontal-scroll-container',
        alignTabsClass,
        grow ? 'flex-grow' : '',
      ]"
    >
      <div ref="tabsContainer" class="flex relative">
        <slot />

        <div
          v-if="!hideSlider && sliderStyle"
          class="absolute bottom-0 h-[2px] transition-all duration-300"
          :style="sliderStyle"
          :class="sliderColor"
        />
      </div>
    </div>

    <!-- Next arrow -->
    <KunBtn
      v-if="showArrows && showNext"
      :icon="nextIcon"
      variant="text"
      size="sm"
      @click="scrollNext"
    />
  </div>
</template>

<script setup>
import { ref, computed, provide } from 'vue'
import KunBtn from '@/components/KunBtn/src/components/KunBtn.vue'
import { useTabsGroup } from '../composables/useTabsGroup'

const props = defineProps({
  modelValue: [String, Number, Array],
  items: Array,
  alignTabs: { type: String, default: 'start' },
  direction: { type: String, default: 'horizontal' },
  bgColor: { type: String, default: '' },
  color: String,
  sliderColor: { type: String, default: 'bg-primary' },
  selectedClass: { type: String, default: 'text-primary font-medium' },
  grow: Boolean,
  fixedTabs: Boolean,
  centerActive: Boolean,
  hideSlider: Boolean,
  showArrows: Boolean,
  nextIcon: { type: String, default: 'ri-arrow-right-s-line' },
  prevIcon: { type: String, default: 'ri-arrow-left-s-line' },
  height: [String, Number],
  multiple: Boolean,
  mandatory: {
    type: [Boolean, String],
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const tabsWrapper = ref(null)
const tabsContainer = ref(null)

const {
  activeIndex,
  sliderStyle,
  registerTab,
  showPrev,
  showNext,
  scrollNext,
  scrollPrev,
  select,
} = useTabsGroup({
  modelValue: props.modelValue,
  emit,
  tabsWrapper,
  tabsContainer,
  multiple: props.multiple,
  mandatory: props.mandatory,
  centerActive: props.centerActive,
})

const heightPx = computed(() => (props.height ? `${props.height}px` : undefined))

const alignTabsClass = computed(() => {
  return {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    title: 'items-center',
  }[props.alignTabs] || 'justify-start'
})

// Contexto para KunTab y KunTabWindow
provide('modelValue', computed(() => props.modelValue))
provide('updateModelValue', select)
provide('registerTab', registerTab)
</script>

<style scoped>
/* En el componente (puedes usar style scoped) */
.horizontal-scroll-container {
  -ms-overflow-style: none;  /* IE/Edge */
  scrollbar-width: none;     /* Firefox */
}
.horizontal-scroll-container::-webkit-scrollbar {
  display: none;             /* Chrome/Safari */
}
</style>