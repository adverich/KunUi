<template>
  <li
    ref="liRef"
    role="option"
    :aria-selected="isItemSelected || isActive"
    :aria-disabled="disabled"
    tabindex="-1"
    class="w-full flex"
    :class="[
      'kun-list-item',
      bgItems,
      textColor,
      itemPosition,
      {
        'cursor-not-allowed opacity-50': disabled,
        [`cursor-pointer ${hoverBg}`]: !disabled,
        [activeClass]: isItemSelected || isActive,
        'px-4 py-2': !noGutters,
      }
    ]"
    @keydown.enter.prevent="handleClick"
    @click="handleClick"
    v-bind="$attrs"
  >
    <!-- Prepend -->
    <div v-if="hasPrepend" class="shrink-0 flex items-center gap-2 me-3">
      <slot name="prepend">
        <img
          v-if="prependAvatar"
          :src="prependAvatar"
          class="w-8 h-8 rounded-full"
        />
        <component
          v-if="isComponent(prependIcon)"
          :is="prependIcon"
          class="w-5 h-5"
        />
        <i
          v-else-if="prependIcon"
          :class="prependIcon"
          class="text-xl leading-none"
        />
      </slot>
    </div>

    <!-- Main content -->
    <div class="flex flex-col min-w-0 flex-1">
      <slot>
        <slot name="title" />
        <slot name="subtitle" />
      </slot>
    </div>

    <!-- Append -->
    <div v-if="hasAppend" class="shrink-0 flex items-center gap-2 ms-3">
      <slot name="append">
        <img
          v-if="appendAvatar"
          :src="appendAvatar"
          class="w-8 h-8 rounded-full"
        />
        <component
          v-if="isComponent(appendIcon)"
          :is="appendIcon"
          class="w-5 h-5"
        />
        <i
          v-else-if="appendIcon"
          :class="appendIcon"
          class="text-xl leading-none"
        />
      </slot>
    </div>
  </li>
</template>

<script setup>
import { ref, inject, onMounted, onBeforeUnmount, computed } from 'vue'

const props = defineProps({
  value: [String, Number, Boolean, Object, Array, null],
  to: [String, Object],
  disabled: Boolean,
  active: Boolean,
  activeClass: {
    type: String,
    default: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
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
  noGutters: Boolean,
  itemPosition: {
    type: String,
    default: 'items-start',
  },
  prependIcon: [String, Object, Function],
  appendIcon: [String, Object, Function],
  prependAvatar: String,
  appendAvatar: String,
})

const liRef = ref(null)
const registerRef = inject('registerListItemRef', null)
const listContext = inject('kunListContext', null)

onMounted(() => {
  if (registerRef && liRef.value) {
    registerRef(liRef.value)
  }
})

onBeforeUnmount(() => {
  if (registerRef) {
    registerRef(null)
  }
})

const isItemSelected = computed(() => {
  return listContext?.isSelected?.(props.value) ?? false
})

const isActive = computed(() => props.active)

const hasPrepend = computed(() => !!(props.prependIcon || props.prependAvatar))
const hasAppend = computed(() => !!(props.appendIcon || props.appendAvatar))

function isComponent(val) {
  return typeof val === 'object' || typeof val === 'function'
}

function handleClick() {
  if (props.disabled) return

  liRef.value?.dispatchEvent(
    new CustomEvent('select', {
      detail: props.value,
      bubbles: true,
    })
  )

  if (listContext && props.value !== null) {
    listContext.toggleItem?.(props.value)

    liRef.value?.dispatchEvent(
      new CustomEvent('selected', {
        detail: props.value,
        bubbles: true,
      })
    )
  }
}
</script>
