<template>
  <component
    ref="rootEl"
    :is="componentTag"
    v-bind="componentAttrs"
    :class="computedClass"
    :style="attrs.style"
    :disabled="isButton && (loading || disabled)"
    @click="emits('click', $event)"
    @keydown="emits('keydown', $event)"
    @keyup="emits('keyup', $event)"
    @keypress="emits('keypress', $event)"
  >
    <div :class="['relative flex items-center justify-center', hasCustomWidth ? '' : 'w-full', hasCustomHeight ? '' : 'h-full']">
      <!-- Loader encima sin opacidad -->
      <template v-if="loading">
        <slot name="loader">
          <div class="absolute inset-0 flex items-center justify-center z-10">
            <KunLoaderCircular size="20" width="5" />
          </div>
        </slot>
      </template>

      <!-- Contenido del botón con opacidad -->
      <div :class="{ 'opacity-50': loading }" class="flex items-center justify-center w-full h-full">
        <!-- Prepend -->
        <template v-if="$slots.prepend || prependIcon">
          <span class="mr-2 flex items-center">
            <slot name="prepend" />
            <component :is="renderIcon(prependIcon)" />
          </span>
        </template>

        <!-- Texto o ícono central -->
        <span v-if="text || $slots.default || icon" class="truncate flex items-center justify-center">
          <template v-if="icon && !text && !$slots.default">
            <component :is="renderIcon(icon)" />
          </template>
          <template v-else>
            <slot>{{ text }}</slot>
          </template>
        </span>

        <!-- Append -->
        <template v-if="$slots.append || appendIcon">
          <span class="ml-2 flex items-center">
            <slot name="append" />
            <component :is="renderIcon(appendIcon)" />
          </span>
        </template>
      </div>
    </div>
  </component>
</template>

<script setup>
import { computed, ref, useAttrs, useSlots, h } from 'vue'
import { RouterLink } from 'vue-router'
import KunLoaderCircular from '@/components/KunLoaderCircular/src/components/KunLoaderCircular.vue';
import KunIcon from '@/components/KunIcon/src/components/KunIcon.vue'

const slots = useSlots()
const attrs = useAttrs()

const props = defineProps({
  text: String,
  size: {
    type: String,
    default: 'md',
    validator: v => ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'].includes(v)
  },
  minWidth: { type: String, default: 'min-w-[3rem]' },
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
  bgColor: { type: String, default: 'bg-button' },
  textColor: {
    type: String,
    default: 'text-slate-800 dark:text-slate-200'
  },
  to: [String, Object],
  href: String,
  replace: Boolean,
  target: String,
  ring: Boolean,
  icon: [Boolean, String, Function, Object, Array],
  prependIcon: [String, Function, Object, Array],
  appendIcon: [String, Function, Object, Array],
  iconSize: { type: String, default: null },
  focusColor: { type: String, default: null }
})

const emits = defineEmits(['click', 'keydown', 'keyup', 'keypress'])

const isLink = computed(() => !!props.to || !!props.href)
const isButton = computed(() => !isLink.value)

const componentTag = computed(() => {
  if (props.href) return 'a'
  if (props.to) return RouterLink
  return 'button'
})

const renderIcon = (icon) => {
  if (!icon || icon === false) return null;
  if (icon === true && !props.icon) return null;

  return h(KunIcon, {
    icon,
    size: resolvedIconSize.value,
    color: props.textColor ?? 'text-font-color',
    disabled: props.disabled,
  });
};

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

const resolvedIconSize = computed(() => {
  if (props.iconSize) return props.iconSize
  switch (props.size) {
    case 'xxs': return 'text-xs'
    case 'xs':  return 'text-xs'
    case 'sm':  return 'text-sm'
    case 'md':  return 'text-base'
    case 'lg':  return 'text-lg'
    case 'xl':  return 'text-xl'
    case 'xxl': return 'text-2xl'
    default:    return 'text-base'
  }
})

const variantClasses = computed(() => {
  const bg = props.bgColor
  const text = props.textColor

  switch (props.variant) {
    case 'default': return `${bg} ${text} shadow hover:brightness-95`
    case 'tonal':   return `${bg} ${text} shadow-sm hover:shadow-md`
    case 'soft':    return `${bg} ${text} hover:bg-opacity-30 shadow-sm`
    case 'outlined':return `bg-transparent ${text} border ${bg} border-opacity-40 hover:bg-black/5`
    case 'plain':   return `bg-transparent ${text} hover:bg-transparent active:bg-black/10`
    case 'text':    return `${bg} ${text} hover:bg-opacity-10 active:bg-black/5`
    default:        return `${bg} ${text}`
  }
})

const hasText = computed(() => !!props.text)

const hasCustomWidth = computed(() => {
  return attrs.class?.includes('w-') || attrs.class?.includes('min-w-') || attrs.class?.includes('max-w-');
})

const hasCustomHeight = computed(() => {
  return attrs.class?.includes('h-') || attrs.class?.includes('min-h-') || attrs.class?.includes('max-h-');
})

const isIconOnly = computed(() => {
  const isSingleCharText = props.text?.length === 1 && !slots.default && !props.icon;
  return (!!props.icon && !props.text && !slots.default) || isSingleCharText;
})

const computedClass = computed(() => {
  const base = [
    'inline-flex items-center justify-center break-keep transition-all whitespace-nowrap',
    !isIconOnly.value ? buttonSize(props.size) : '',
    props.fontWeight,
    props.rounded,
    props.textAlign,
    variantClasses.value,
    'relative'
  ];

  if (attrs.class) base.push(attrs.class);

  if (isIconOnly.value) {
    base.push('aspect-square justify-center items-center');
    switch (props.size) {
      case 'xxs': base.push('p-1'); break;
      case 'xs':  base.push('p-1.5'); break;
      case 'sm':  base.push('p-2'); break;
      case 'md':  base.push('p-2.5'); break;
      case 'lg':  base.push('p-3'); break;
      case 'xl':  base.push('p-3.5'); break;
      case 'xxl': base.push('p-4'); break;
      default:    base.push('p-2.5');
    }
  }

  if (!props.loading && !props.disabled) {
    base.push(
      'hover:opacity-90',
      'focus:outline-none',
      props.ring ? 'focus:ring-2 focus:ring-offset-2' : '',
      'active:scale-[.98]',
      'transition duration-100 ease-in-out',
      'cursor-pointer',
      props.focusColor ? `${props.focusColor}` : '',
    );
  } else {
    base.push('pointer-events-none');
    if (props.disabled) base.push('opacity-50 cursor-not-allowed');
  }

  // Solo aplicar minWidth si no hay clase de ancho personalizada
  if (hasText.value && !isIconOnly.value && !hasCustomWidth.value) {
    base.push(props.minWidth);
  }

  return base.filter(Boolean);
});

const rootEl = ref(null);
defineExpose({
  focus: () => rootEl.value?.focus?.()
});
</script>