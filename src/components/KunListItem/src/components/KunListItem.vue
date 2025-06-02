<template>
  <li
    ref="liRef"
    role="option"
    :aria-selected="isItemSelected || isActive"
    :aria-disabled="disabled"
    tabindex="-1"
    class="w-full flex flex-col"
    :class="[
      'kun-list-item',
      bgItems,
      itemPosition,
      textColor,
      {
        'cursor-not-allowed opacity-50': disabled,
        [`cursor-pointer ${hoverBg}`]: !disabled,
        [activeClass]: isItemSelected || isActive,
        'px-4 py-2': !noGutters,
      }
    ]"
    @click="handleClick"
    v-bind="$attrs"
  >
    <slot />
  </li>
</template>

<script setup>
import { ref, inject, onMounted, onBeforeUnmount, computed } from 'vue'

const props = defineProps({
  value: {
    type: [String, Number, Boolean, Object, Array, null],
    default: null
  },
  disabled: Boolean,
  active: Boolean,
  activeClass: {
    type: String,
    default: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
  },
  bgItems: {
    type: String,
    default: 'bg-transparent',
  },
  textColor: {
    type: String,
    default: 'text-black dark:text-white',
  },
  hoverBg: {
    type: String,
    default: 'hover:bg-gray-100 dark:hover:bg-gray-600',
  },
  noGutters: {
    type: Boolean,
    default: false,
  },
  itemPosition: {
    type: String,
    default: 'items-start'
  }
})

const liRef = ref(null)
const registerRef = inject('registerListItemRef', null)
const listContext = inject('kun-list', null)

// Registro para navegación/focus externo si fuera necesario
onMounted(() => {
  if (registerRef && liRef.value) {
    registerRef(liRef.value)
  }
})

onBeforeUnmount(() => {
  if (registerRef) {
    registerRef(null) // elimina ref al desmontar
  }
})

// Estado reactivo de selección
const isItemSelected = computed(() => {
  return listContext?.isSelected?.(props.value) ?? false
})

// Estado activo (externo)
const isActive = computed(() => props.active)

// Click handler
function handleClick() {
  if (props.disabled) return
  if (listContext && props.value !== null) {
    listContext.toggleItem?.(props.value)
  }
}
</script>
