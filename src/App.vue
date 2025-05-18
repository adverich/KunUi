<template>
  <li class="kun-list-group">
    <!-- Título del grupo -->
    <div
      :class="[
        'kun-list-group-title',
        'px-4 py-2 cursor-pointer flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md',
        { 'bg-gray-100 dark:bg-gray-700': isOpen }
      ]"
      @click="toggle"
    >
      <slot name="activator">{{ props.title }}</slot>

      <!-- Icono de flecha (expandir/colapsar) -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 transition-transform duration-200"
        :class="{ 'rotate-180': !isOpen }"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>

    <!-- Contenido del grupo (items) -->
    <div v-show="isOpen" class="kun-list-group-items pl-4 border-l-2 border-gray-200 dark:border-gray-700 mt-1">
      <ul role="list" class="space-y-1">
        <slot />
      </ul>
    </div>
  </li>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: [String, Number],
    default: ''
  },
  open: {
    type: Boolean,
    default: false
  }
})

const isOpen = ref(props.open)

function toggle() {
  isOpen.value = !isOpen.value
}
</script>