<template>
  <ul
    ref="ulRef"
    role="list"
    class="w-full kun-list"
    tabindex="-1"
    @keydown="onKeydown"
    @select="e => emit('click:select', (e as CustomEvent).detail)"
    :class="[
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

<script setup lang="ts">
import { ref, provide, computed, onUpdated, type Ref } from 'vue'
import { kunListProps } from '../composables/kunListProps.js'

const props = defineProps(kunListProps)

const emit = defineEmits(['keyDown', 'click:select', 'update:selected'])

const ulRef: Ref<HTMLUListElement | null> = ref(null)
const itemRefs: Ref<HTMLElement[]> = ref([])

const selectedItems = defineModel('selected', {
  type: [Array, String, Number, Object, null],
  default: () => [],
})

provide('registerListItemRef', (el: HTMLElement | null) => {
  if (el) {
    // Agregar solo si está conectado y no existe ya
    if (el.isConnected && !itemRefs.value.includes(el)) {
      itemRefs.value.push(el);
      itemRefs.value.sort((a, b) => {
        const idA = a.id ?? '';
        const idB = b.id ?? '';
        return idA.localeCompare(idB, undefined, { numeric: true, sensitivity: 'base' });
      });
    }
  } else {
    // Eliminar referencias muertas
    itemRefs.value = itemRefs.value.filter(r => r && r.isConnected)
  }
})

const isMultiple = computed(() => props.selectable && props.selectionMode === 'multiple')

function toggleItem(value: unknown): void {
  if (!props.selectable || value == null) return

  if (isMultiple.value) {
  const selectedArray = selectedItems.value as unknown[]
  const exists = selectedArray.includes(value)
  selectedItems.value = exists
    ? selectedArray.filter((v: unknown) => v !== value)
    : [...selectedArray, value]
  } else {
    selectedItems.value = value
  }
}

onUpdated(() => {
  itemRefs.value = itemRefs.value.filter(r => r && r.isConnected)
})

function isSelected(value: unknown): boolean {
  if (!props.selectable || value == null) return false
  return isMultiple.value
  ? selectedItems.value?.includes?.(value)
  : selectedItems.value === value
}

// 🔴🔴 ESTE PROVIDE FALTABA
provide('kunListContext', {
  toggleItem,
  isSelected
})

function onKeydown(e: KeyboardEvent): void {
  emit('keyDown', e);

  const target = e.target as HTMLElement | null;
  if (
    ['INPUT','TEXTAREA'].includes(target?.tagName ?? '') ||
    target?.isContentEditable
  ) {
    return;
  }

  const key = e.key
  const items = itemRefs.value.filter(el => el && el.isConnected)

  if (!items.length || !['ArrowUp', 'ArrowDown', 'Enter'].includes(key)) return

  if (key === 'Enter') {
    const item = document.activeElement as HTMLElement | null
    if (item?.getAttribute('role') === 'menuitem') item.click()
    return
  }

  if (key === 'ArrowUp' || key === 'ArrowDown') {
    e.preventDefault()
    const currentIndex = items.findIndex(i => i === document.activeElement)
    let nextIndex = -1

    if (currentIndex === -1) {
      nextIndex = key === 'ArrowDown' ? 0 : items.length - 1
    } else if (key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % items.length
    } else if (key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + items.length) % items.length
    }

    const el = items[nextIndex]
    el?.focus?.()
    return
  }
}

function focusWithKey(key = 'ArrowDown'): void {
  const items = itemRefs.value.filter(Boolean)
  if (!items.length) return;
  
  const index = key === 'ArrowDown' ? 0 : items.length - 1
  const el = items[index]
  el?.focus?.()
}

defineExpose({ focusWithKey, focus: () => ulRef.value?.focus?.() })
</script>

