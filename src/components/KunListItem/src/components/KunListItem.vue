<template>
  <li
    role="listitem"
    :class="[
      'kun-list-item',
      {
        'px-4 py-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2':
          !disabled,
        'text-gray-500 dark:text-gray-400 cursor-not-allowed': disabled,
        [activeClass]: isActive
      },
    ]"
    @click="handleClick"
  >
    <slot />
  </li>
</template>

<script setup>
import { ref, inject } from 'vue'

// === Props ===
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
  }
})

// === Estado local de activo/inactivo ===
const isActive = ref(props.active)

// === Contexto de lista (si está dentro de KunList) ===
const listContext = inject('kun-list', null)

// === Manejo de clic ===
function handleClick() {
  if (props.disabled) return

  // Si está dentro de un contexto de lista seleccionable
  if (listContext && props.value !== null) {
    listContext.toggleItem(props.value)
  } else {
    // Si no, simplemente alternamos el estado local
    isActive.value = !isActive.value
  }
}
</script>