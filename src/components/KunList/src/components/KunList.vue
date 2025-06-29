<template>
  <ul
    ref="ulRef"
    role="list"
    class="w-full kun-list"
    tabindex="-1"
    @keydown.prevent="onKeydown"
    @select="e => emit('click:select', e.detail)"
    @selected="e => emit('update:selected', e.detail)"
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
    validator: v => ['single', 'multiple', true, false].includes(v),
  },
  selected: {
    type: [Array, String, Number, Boolean, Object, null],
    default: null
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

const emit = defineEmits(['keyDown', 'click:select', 'update:selected'])

const ulRef = ref(null)
const itemRefs = ref([])

// Usa useKunList para manejar selección
const { selectedValues } = useKunList(props)

watch(
  () => props.selected,
  (val) => {
    selectedValues.value = props.selectable === 'multiple'
      ? Array.isArray(val) ? [...val] : []
      : val != null ? [val] : []
  },
  { immediate: true }
)

watch(
  selectedValues,
  (val) => {
    emit(
      'update:selected',
      props.selectable === 'multiple' ? [...val] : val[0] ?? null
    )
  }
)

provide('registerListItemRef', el => {
  if (el && !itemRefs.value.includes(el)) {
    itemRefs.value.push(el)
  }
})

function onKeydown(e) {
  emit('keyDown', e)
  const key = e.key
  const items = itemRefs.value.filter(Boolean)

  if (!items.length || !['ArrowUp', 'ArrowDown', 'Enter'].includes(key)) return

  if (key === 'Enter') {
    const item = document.activeElement
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

function focusWithKey(key = 'ArrowDown') {
  const items = itemRefs.value.filter(Boolean)
  if (!items.length) return
  const index = key === 'ArrowDown' ? 0 : items.length - 1
  const el = items[index]
  el?.focus?.()
}

defineExpose({ focusWithKey, focus: () => ulRef.value?.focus?.() })
</script>
