<template>
  <component
    :is="componentTag"
    v-bind="componentAttrs"
    :class="computedClass"
    :style="attrs.style"
    :disabled="isButton && (loading || disabled)"
  >
    <!-- Loader -->
    <template v-if="loading">
      <slot name="loader">
        <span
          class="mr-2 h-5 w-5 border-[3px] border-current border-t-transparent rounded-full animate-spin"
        ></span>
      </slot>
    </template>

    <!-- Prepend -->
    <template v-else-if="$slots.prepend">
      <span class="mr-2 flex items-center">
        <slot name="prepend" />
      </span>
    </template>

    <!-- Text -->
    <span v-if="!loading && (text || $slots.default)" class="truncate">
      <slot>{{ text }}</slot>
    </span>

    <!-- Append -->
    <template v-if="!loading && $slots.append">
      <span class="ml-2 flex items-center">
        <slot name="append" />
      </span>
    </template>
  </component>
</template>

<script setup>
import { computed, useAttrs } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  text: String,
  size: {
    type: String,
    default: 'md',
    validator: v => ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'].includes(v)
  },
  minWidth: { type: String, default: 'min-w-[4rem]' },
  fontWeight: { type: String, default: 'font-medium' },
  rounded: { type: String, default: 'rounded-lg' },
  textAlign: { type: String, default: 'text-center' },
  variant: {
    type: String,
    default: 'default',
    validator: v => ['default', 'tonal', 'plain', 'outlined', 'soft', 'text'].includes(v)
  },
  disabled: Boolean,
  loading: Boolean,
  bgColor: {
    type: String,
    default: 'bg-slate-200 dark:bg-slate-800'
  },
  textColor: {
    type: String,
    default: 'text-slate-700 dark:text-slate-300'
  },
  to: [String, Object],
  href: String,
  replace: Boolean,
  target: String,
  ring: Boolean
})

const attrs = useAttrs()
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
      rel: props.target === '_blank' ? 'noopener noreferrer' : null
    }
  }
  if (props.to) {
    return {
      to: props.to,
      replace: props.replace
    }
  }
  return {
    type: 'button',
    disabled: props.loading || props.disabled
  }
})

const buttonSize = (size) => {
  switch (size) {
    case 'xxs': return 'px-1 py-1 text-xs'
    case 'xs': return 'px-2 py-2 text-xs'
    case 'sm': return 'px-2 py-1 text-sm'
    case 'md': return 'px-3 py-2 text-sm'
    case 'lg': return 'px-4 py-2 text-base'
    case 'xl': return 'px-5 py-3 text-lg'
    case 'xxl': return 'px-6 py-4 text-xl'
    default: return 'px-3 py-2 text-sm'
  }
}

const variantClasses = computed(() => {
  const bg = props.bgColor
  const text = props.textColor

  switch (props.variant) {
    case 'default':
      return `${bg} ${text} shadow hover:brightness-95`

    case 'tonal':
      // tonal tiene fondo claro, sin opacidad, y efecto sutil
      return `${bg} ${text} shadow-sm hover:shadow-md`

    case 'soft':
      // soft tiene fondo con opacidad y sombra leve
      return `${bg} ${text} hover:bg-opacity-30 shadow-sm`

    case 'outlined':
      // contorno + hover gris claro
      return `bg-transparent ${text} border ${bg} border-opacity-40 hover:bg-black/5`

    case 'plain':
      // no hay fondo, pero click genera fondo negro opaco
      return `bg-transparent ${text} hover:bg-transparent active:bg-black/10`

    case 'text':
      // solo texto, active levemente visible
      return `${bg} ${text} hover:bg-opacity-10 active:bg-black/5`

    default:
      return `${bg} ${text}`
  }
})

const hasText = computed(() => !!props.text)

const computedClass = computed(() => {
  const base = [
    'inline-flex items-center justify-center break-keep transition-all whitespace-nowrap',
    buttonSize(props.size),
    props.fontWeight,
    props.rounded,
    props.textAlign,
    variantClasses.value
  ]

  if (!props.loading && !props.disabled) {
    base.push(
      'hover:opacity-90',
      'focus:outline-none',
      props.ring ? 'focus:ring-2 focus:ring-offset-2' : '',
      'active:scale-[.98]',
      'transition duration-100 ease-in-out',
      'cursor-pointer'
    )
  } else {
    base.push('opacity-50 cursor-not-allowed')
  }

  // Agrega minWidth si tiene texto
  if (hasText.value) {
    base.push(props.minWidth)
  }

  // Agrega cualquier clase personalizada pasada desde el padre
  if (attrs.class) {
    base.push(attrs.class)
  }

  return base.filter(Boolean)
})
</script>
