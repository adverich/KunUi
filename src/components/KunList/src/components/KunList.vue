<template>
  <ul
    role="list"
    class="w-full"
    ref="ulRef"
    tabindex="-1"
    @keydown="onKeydown"
    @select="handleSelect"
    @selected="handleUpdateSelected"
    :class="[
      'kun-list',
      bgList,
      borderColor,
      {
        'space-y-1': !dense,
        'space-y-0.5': dense,
        'pl-4 border-l-2': sub,
        'p-2 rounded-md': nav,
      },
    ]"
    v-bind="$attrs"
  >
    <slot />
  </ul>
</template>

<script setup>
import { ref, provide } from 'vue'
import { useKunList } from '../composables/useKunList'

const props = defineProps({
  nav: Boolean,
  sub: Boolean,
  dense: Boolean,
  selectable: {
    type: [Boolean, String],
    default: false,
    validator: value => ['single', 'multiple', true, false].includes(value),
  },
  bgList: {
    type: String,
    default: 'bg-transparent',
  },
  borderColor: {
    type: String,
    default: 'border-gray-300 dark:border-gray-700'
  }
})
const emits = defineEmits(['keyDown', 'click:select', 'update:selected'])

useKunList(props)

const ulRef = ref(null)
const itemRefs = ref([])

defineExpose({
  focusWithKey: (key) => {
    const items = itemRefs.value.filter(Boolean)
    if (items.length === 0) return

    // Mover el foco directamente al ítem adecuado
    if (key === 'ArrowDown') {
      items[0]?.focus()
    } else if (key === 'ArrowUp') {
      items[items.length - 1]?.focus()
    }
  },
  focus: () => {
    ulRef.value?.focus?.()
  }
})

provide('registerListItemRef', (el) => {
  if (el) {
    // ✅ Evita push duplicados que causan renders
    if (!itemRefs.value.includes(el)) {
      itemRefs.value.push(el)
    }
  } else {
    // ✅ Borra solo si existe
    itemRefs.value = itemRefs.value.filter(item => item !== el)
  }
})

function onKeydown(e) {
  const key = e.key

  emits('keyDown', e)
  if (!['ArrowDown', 'ArrowUp'].includes(key)) return
  e.preventDefault()

  const items = itemRefs.value.filter(Boolean)
  if (items.length === 0) return

  const currentIndex = items.findIndex(el => el === document.activeElement)

  // Si el foco no está en un ítem válido, enfocar el primero o último
  if (currentIndex === -1) {
    if (key === 'ArrowDown') {
      items[0]?.focus()
    } else if (key === 'ArrowUp') {
      items[items.length - 1]?.focus()
    }
    return
  }

  let nextIndex = currentIndex

  if (key === 'ArrowDown') {
    nextIndex = (currentIndex + 1) % items.length
  } else if (key === 'ArrowUp') {
    nextIndex = (currentIndex - 1 + items.length) % items.length
  }

  items[nextIndex]?.focus()
}

function handleSelect(item) {
  emits('click:select', item.detail)
}

function handleUpdateSelected(event) {
  emits('update:selected', event.detail)
}
</script>
