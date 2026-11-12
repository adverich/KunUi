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

    <!-- Contenido colapsable (animación por grid-rows, sin JS) -->
    <div
      class="kun-list-group__content grid transition-[grid-template-rows] duration-300 ease-in-out"
      :class="modelValue ? '[grid-template-rows:1fr]' : '[grid-template-rows:0fr]'"
      :id="contentId"
      role="region"
      :inert="!modelValue"
    >
      <div class="overflow-hidden min-h-0">
        <div class="pl-4">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'
import KunIcon from '../../../KunIcon/src/components/KunIcon.vue'
import { kunListGroupProps } from '../composables/kunListGroupProps.js'

const props = defineProps(kunListGroupProps)

const emit = defineEmits(['update:modelValue'])

const generatedId = useId()
const contentId = computed(() => props.id ? `${props.id}-content` : `kun-list-group-content-${generatedId}`)

const toggle = () => {
  emit('update:modelValue', !props.modelValue)
}
</script>

