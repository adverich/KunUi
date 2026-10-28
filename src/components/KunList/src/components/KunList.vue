<template>
  <ul
    ref="ulRef"
    role="list"
    class="w-full kun-list"
    tabindex="-1"
    @keydown="onKeydown"
    @select="e => emit('click:select', (e as CustomEvent).detail)"
    :class="containerClass"
    v-bind="$attrs"
  >
    <slot />
  </ul>
</template>

<script setup lang="ts">
import { ref, provide, computed, onUpdated, type Ref } from 'vue'
import { kunListProps } from '../composables/kunListProps.js'
import { KUN_SURFACE_BG, resolveKunColor, resolveKunVariant } from '../../../../theme/kunVariants.js'

const props = defineProps(kunListProps)

const emit = defineEmits(['keyDown', 'click:select', 'update:selected'])

const ulRef: Ref<HTMLUListElement | null> = ref(null)
const itemRefs: Ref<HTMLElement[]> = ref([])

const selectedItems = defineModel<unknown[] | string | number | object | null>('selected', {
  // `null`/`undefined` saltean la validación runtime si no es `required`;
  // no se incluye `null` en el array (no es constructor válido).
  type: [Array, String, Number, Object],
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
    selectedItems.value = value as unknown[] | string | number | object | null
  }
}

onUpdated(() => {
  itemRefs.value = itemRefs.value.filter(r => r && r.isConnected)
})

function isSelected(value: unknown): boolean {
  if (!props.selectable || value == null) return false
  const sel = selectedItems.value
  return isMultiple.value
  ? Array.isArray(sel) && sel.includes(value)
  : sel === value
}

// ------------------------------------------------------------------
// Color/variante del contenedor (prop > theme.defaults.list > default).
// Solo capa de superficie: fondo + ring; el texto lo colorean los items.
// ------------------------------------------------------------------
const resolvedColor = computed(() => resolveKunColor(props.color, 'list'))
const resolvedVariant = computed(() => resolveKunVariant(props.variant, 'list'))
// `bg` libre gana sobre color x variante para el fondo del contenedor.
const surfaceClass = computed(() => props.bg ?? KUN_SURFACE_BG[resolvedColor.value][resolvedVariant.value])
const containerClass = computed(() => [
  props.fontSize,
  surfaceClass.value,
  'rounded-lg',
  {
    'space-y-1': !props.dense,
    'space-y-0.5': props.dense,
    'ps-4 border-s-2 border-primary': props.sub,
    'p-2 rounded-md': props.nav,
  },
])

provide('kunListContext', {
  toggleItem,
  isSelected,
  /** Indica si la lista gestiona selección (selectable). */
  gestiona: props.selectable,
  /** Accesor reactivo: el item inyecta el color resuelto de la lista. */
  get color() { return resolvedColor.value },
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

