<template>
  <component
    :is="componentTag"
    v-bind="componentAttrs"
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
    :disabled="isButton && (loading || disabled)"
  >
    <!-- Custom loader slot -->
    <template v-if="loading">
      <slot name="loader">
        <span
          class="mr-2 h-5 w-5 border-[3px] border-current opacity-100 border-opacity-100 border-t-transparent rounded-full animate-spin"
        ></span>
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
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

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
  bgColor: { type: String, default: 'bg-indigo-600' },
  textColor: { type: String, default: 'text-white' },
  to: [String, Object],
  href: String,
})

const isLink = computed(() => !!props.to || !!props.href)
const isButton = computed(() => !isLink.value)

const componentTag = computed(() => {
  if (props.href) return 'a'
  if (props.to) return RouterLink
  return 'button'
})

const componentAttrs = computed(() => {
  if (props.href) {
    return {
      href: props.href,
      target: props.target ?? '_self',
    }
  }
  if (props.to) {
    return {
      to: props.to,
      replace: props.replace,
    }
  }
  return {
    type: 'button',
    disabled: props.loading || props.disabled,
  }
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
  const bg = props.bgColor || 'bg-indigo-600'
  const text = props.textColor || 'text-white'

  switch (props.variant) {
    case 'default':
      return `${bg} ${text} shadow hover:brightness-90 transition`
    case 'tonal':
      return `${bg} ${text} bg-opacity-20 hover:bg-opacity-30 transition`
    case 'plain':
      return `bg-transparent ${text} hover:bg-gray-100 transition`
    case 'outline':
      return `bg-transparent border ${bg} ${text} border-opacity-80 hover:bg-opacity-10 transition`
    case 'soft':
      return `${bg} ${text} shadow-md bg-opacity-30 hover:bg-opacity-40 transition`
    default:
      return `${bg} ${text}`
  }
})
</script>
