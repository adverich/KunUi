<template>
<button
  type="button"
  class="flex items-center justify-center break-keep transition-all"
  :class="[
    minWidth,
    buttonSize(size),
    fontWeight,
    variantClasses,
    rounded,
    textAlign,
    'whitespace-nowrap',
    loading || disabled
      ? 'opacity-50 cursor-not-allowed'
      : 'hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[.98] transition duration-100 ease-in-out cursor-pointer'
  ]"
  :disabled="loading || disabled"
>
    <!-- Custom loader slot -->
    <template v-if="loading">
      <slot name="loader">
        <!-- Default loader -->
        <span class="mr-2 h-5 w-5 border-[3px] border-current opacity-100 border-opacity-100 border-t-transparent rounded-full animate-spin" ></span>
      </slot>
    </template>

    <!-- Prepend icon -->
    <span v-else-if="$slots.prepend" class="mr-2 flex items-center">
      <slot name="prepend" />
    </span>

    <!-- Text / Default slot -->
    <span v-if="!loading && ($slots.default || text)" class="truncate">
      <slot>
        {{ text }}
      </slot>
    </span>

    <!-- Append icon -->
    <span v-if="!loading && $slots.append" class="ml-2 flex items-center">
      <slot name="append" />
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: { type: String, default: null },
  size: { type: String, default: 'md' },
  minWidth: { type: String, default: 'min-w-[6rem]' },
  fontWeight: { type: String, default: 'font-medium' },
  rounded: { type: String, default: 'rounded-lg' },
  textAlign: { type: String, default: 'text-center' },
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'tonal', 'plain', 'outline', 'soft'].includes(v)
  },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  bgColor: { type: String, default: null },
  textColor: { type: String, default: null }
})

const buttonSize = (size) => {
  switch (size) {
    case "xxs": return 'px-1 py-1 text-xs'
    case "xs": return 'px-2 py-2 text-xs'
    case "sm": return 'px-1 py-1 text-sm'
    case "md": return 'px-2 py-2 text-sm'
    case "lg": return 'px-3 py-3 text-sm'
    case "xl": return 'px-3 py-3 text-base'
    case "xxl": return 'px-4 py-4 text-base'
  }
}

const variantClasses = computed(() => {
  if (props.bgColor || props.textColor) {
    return `${props.bgColor ?? ''} ${props.textColor ?? ''}`
  }

  switch (props.variant) {
    case 'default':
      return 'bg-green-700 text-white'
    case 'tonal':
      return 'bg-green-100 text-green-800'
    case 'plain':
      return 'bg-transparent text-green-700 hover:bg-green-50'
    case 'outline':
      return 'bg-transparent text-green-700 border border-green-700 hover:bg-green-50'
    case 'soft':
      return 'bg-green-200 text-green-900'
    default:
      return ''
  }
})
</script>
