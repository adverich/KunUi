<template>
  <!-- Drawer -->
  <Transition name="kun-drawer">
    <component
      v-show="modelValue || permanent"
      :is="tag"
      class="fixed z-[2001] flex flex-col transition-transform duration-300 ease-in-out"
      :class="[
        computedClass,
        absolute ? 'absolute' : 'fixed',
        floating ? 'border-none' : '',
        {
          'translate-x-0': modelValue || permanent,
          '-translate-x-full': isStart && !modelValue && !permanent,
          'translate-x-full': isEnd && !modelValue && !permanent,
        },
      ]"
      :style="{ top: computedTop, height: computedHeight }"
      @click.stop
    >
      <slot name="prepend" />
      <slot />
      <slot name="append" />
    </component>
  </Transition>

  <!-- Scrim -->
  <Transition name="kun-scrim">
    <div
      v-if="scrim && modelValue && !permanent && !persistent"
      class="fixed inset-0 bg-black/40 z-30"
      @click="close"
    />
  </Transition>
</template>


<script setup>
import { computed, useAttrs } from 'vue'
import { useAppbarHeight } from '@/utils/useLayout'

const emits = defineEmits(['update:model-value'])

const props = defineProps({
  modelValue: Boolean,
  absolute: Boolean,
  border: [Boolean, String, Number],
  color: String,
  elevation: [String, Number],
  floating: Boolean,
  image: String,
  location: {
    type: String,
    default: 'start', // 'start' | 'end' | 'left' | 'right' | etc.
  },
  permanent: Boolean,
  persistent: Boolean,
  rail: Boolean,
  railWidth: {
    type: String,
    default: 'w-[56px]',
  },
  rounded: [Boolean, String, Number],
  scrim: {
    type: [Boolean, String],
    default: true,
  },
  tag: {
    type: [String, Object],
    default: 'nav',
  },
  temporary: Boolean,
  width: { type: String, default: 'w-[256px]' },
  fullHeight: Boolean,
  scrollable: { type: Boolean, default: true },
})

const attrs = useAttrs()

const appbarHeight = useAppbarHeight();
const computedTop = computed(() =>
  props.fullHeight ? '0px' : `${appbarHeight.value}px`
)

const computedHeight = computed(() =>
  props.fullHeight ? '100vh' : `calc(100vh - ${appbarHeight.value}px)`
)

// Width class
const widthClass = computed(() => {
  if (props.rail) return props.railWidth;
  return props.width;
})

// Position class
const positionClass = computed(() => {
  const pos = props.location
  switch (pos) {
    case 'start':
    case 'left':
      return 'left-0 top-0 h-full'
    case 'end':
    case 'right':
      return 'right-0 top-0 h-full'
    case 'top':
      return 'top-0 left-0 w-full'
    case 'bottom':
      return 'bottom-0 left-0 w-full'
    default:
      return 'left-0 top-0 h-full'
  }
})

// Is left or right?
const isStart = computed(() => ['start', 'left'].includes(props.location))
const isEnd = computed(() => ['end', 'right'].includes(props.location))

// Border class
const borderClass = computed(() => {
  if (!props.border) return ''
  if (typeof props.border === 'string') return `border-${props.border}`
  return 'border'
})

// Rounded class
const roundedClass = computed(() => {
  if (props.rounded === true) return 'rounded-r';
  if (typeof props.rounded === 'string') return props.rounded;
  if (typeof props.rounded === 'number') return `rounded-[${props.rounded}px]`;
  return ''
})

const computedClass = computed(() => {
  const base = [
    positionClass.value,
    widthClass.value,
    borderClass.value,
    props.elevation ? `shadow-${props.elevation}` : '',
    roundedClass.value,
    props.color ?? 'bg-surface-dark',
    props.scrollable ? 'overflow-auto' : ''
  ];
  if (attrs.class) base.push(attrs.class);
  return base;
})

// Close method (only if temporary and not persistent)
const close = () => {
  if (!props.persistent) emits('update:model-value', false)
}
</script>

<style scoped>
.kun-drawer-enter-active,
.kun-drawer-leave-active {
  transition: transform 300ms ease-in-out;
}
.kun-drawer-enter-from {
  transform: translateX(-100%);
}
.kun-drawer-leave-to {
  transform: translateX(-100%);
}

/* Scrim Fade */
.kun-scrim-enter-active,
.kun-scrim-leave-active {
  transition: opacity 300ms ease;
}
.kun-scrim-enter-from,
.kun-scrim-leave-to {
  opacity: 0;
}
</style>