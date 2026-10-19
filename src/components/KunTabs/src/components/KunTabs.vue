<template>
  <div
    :class="[
      'relative w-full',
      direction === 'vertical' ? 'flex flex-col' : 'flex',
    ]"
    :style="{ height: heightPx }"
    v-bind="$attrs"
  >
    <!-- Prev arrow -->
    <KunBtn
      v-if="showArrows && showPrev"
      :icon="prevIcon"
      variant="ghost"
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
      variant="ghost"
      size="sm"
      @click="scrollNext"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, provide, type Ref } from 'vue'
import KunBtn from '@/components/KunBtn/src/components/KunBtn.vue'
import { useTabsGroup } from '../composables/useTabsGroup.js'
import { kunTabsProps } from '../composables/kunTabsProps.js'

const props = defineProps(kunTabsProps)

const emit = defineEmits(['update:modelValue'])

const tabsWrapper: Ref<HTMLElement | null> = ref(null)
const tabsContainer: Ref<HTMLElement | null> = ref(null)

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
  getModelValue: () => props.modelValue,
  emit,
  tabsWrapper,
  tabsContainer,
  multiple: props.multiple as boolean,
  mandatory: props.mandatory as boolean,
  centerActive: props.centerActive as boolean,
})

const heightPx = computed(() => {
  if (props.height === undefined || props.height === null || props.height === '') return undefined
  return typeof props.height === 'number' ? `${props.height}px` : props.height
})

const alignTabsClass = computed(() => {
  return {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    title: 'items-center',
  }[props.alignTabs] || 'justify-start'
})

// Contexto para KunTab (`KunTabWindow` usa solo su prop `modelValue`, no inyecta).
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
