<script setup>
import { computed, provide } from 'vue'
import { kunTabWindowProps } from '../composables/kunTabWindowProps'

const props = defineProps(kunTabWindowProps)

const emit = defineEmits(['update:modelValue'])

const isSelected = (itemValue) => {
  if (props.multiple && Array.isArray(props.modelValue)) {
    return props.modelValue.includes(itemValue)
  }
  return props.modelValue === itemValue
}

// Proveer para posible uso en tabs anidadas
provide('kun-tab-window', {
  modelValue: computed(() => props.modelValue),
  select: (val) => emit('update:modelValue', val),
})

</script>

<template>
  <component :is="tag" class="w-full h-full relative">
    <!-- Renderizado por items si se pasan -->
    <template v-if="items.length">
      <template v-for="item in items" :key="item.value">
        <transition
          :name="transition"
          mode="out-in"
          appear
        >
          <div
            v-show="isSelected(item.value)"
            class="w-full h-full absolute top-0 left-0"
            :class="isSelected(item.value) ? selectedClass : ''"
          >
            <slot :name="`item.${item.value}`" :item="item">
              <slot name="item" :item="item" />
            </slot>
          </div>
        </transition>
      </template>
    </template>

    <!-- Renderizado por slots directamente si no hay items -->
    <template v-else>
      <transition :name="transition" mode="out-in" appear>
        <div v-show="show" class="w-full h-full">
          <slot />
        </div>
      </transition>
    </template>
  </component>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
