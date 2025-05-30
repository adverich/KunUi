<template>
  <li
    ref="liRef"
    role="listitem"
    tabindex="-1"
    class="w-full flex flex-col items-start"
    :class="[
      'kun-list-item',
      bgItems,
      {
        'cursor-not-allowed': disabled,
        [`cursor-pointer ${hoverBg}`]: !disabled,
        [activeClass]: isItemSelected || isActive,
        ['px-4 py-2']: !noGutters
      }
    ]"
    @click="handleClick"
  >
    <slot />
  </li>
</template>

<script setup>
import { ref, inject, onMounted, onBeforeUnmount, computed, watch } from 'vue'

const props = defineProps({
  value: {
    type: [String, Number, Boolean, Object, Array, null],
    default: null
  },
  disabled: Boolean,
  active: Boolean, // usado si se controla desde afuera
  activeClass: {
    type: String,
    default: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
  },
  bgItems: {
    type: String,
    default: 'bg-transparent',
  },
  hoverBg: {
    type: String,
    default: 'hover:bg-gray-100 dark:hover:bg-gray-600',
  },
  noGutters: {
    type: Boolean,
    default: false,
  }
})

const liRef = ref(null)
const registerRef = inject('registerListItemRef', null)
const listContext = inject('kun-list', null)

onMounted(() => {
  if (registerRef && liRef.value) {
    registerRef(liRef.value)
  }
})

onBeforeUnmount(() => {
  if (registerRef) {
    registerRef(null) // elimina el ref del registro si el ítem se desmonta
  }
})

// === Estado local si es controlado externamente ===
const isActive = ref(props.active)

watch(() => props.active, (val) => {
  isActive.value = val
})

// === Estado de selección si está dentro de KunList ===
const isItemSelected = computed(() => {
  return listContext?.isSelected?.(props.value) ?? false
})

function handleClick() {
  if (props.disabled) return

  if (listContext && props.value !== null) {
    listContext.toggleItem(props.value)
  }
}
</script>
