<template>
  <component
    :is="tag"
    class="w-full flex flex-col relative"
    :class="mergedClass"
    v-bind="$attrs"
  >
    <!-- Imagen de fondo -->
    <slot name="image" v-if="image" />

    <!-- Contenido principal -->
    <div
      ref="contentRef"
      class="flex items-center w-full justify-between"
      :class="[
        densityClass,
        extended ? 'min-h-[96px]' : '',
        'px-4',
      ]"
    >
      <!-- Título izquierda -->
      <div v-if="titlePosition === 'left'" class="flex justify-center items-center">
        <slot name="title">
          <KunToolbarTitle v-if="title" :text="title" />
        </slot>
      </div>

      <!-- Prepend -->
      <div class="flex items-center gap-2">
        <slot name="prepend" />
      </div>

      <!-- Contenido principal -->
      <div class="flex items-center gap-2">
        <slot />
      </div>

      <div v-if="titlePosition === 'center'" class="flex justify-center items-center">
        <slot name="title">
          <KunToolbarTitle v-if="title" :text="title" />
        </slot>
      </div>

      <!-- Toolbar Items -->
      <slot name="items" />

      <!-- Append -->
      <div class="flex items-center gap-2">
        <slot name="append" />
      </div>

      <div v-if="titlePosition === 'right'" class="flex justify-center items-center">
        <slot name="title">
          <KunToolbarTitle v-if="title" :text="title" />
        </slot>
      </div>
    </div>

    <!-- Extensión -->
    <div
      v-if="hasExtension"
      ref="extensionRef"
      class="w-full"
      :style="{ height: `${extensionHeight}px` }"
    >
      <slot name="extension" />
    </div>
  </component>
</template>

<script setup>
import { computed, ref, useSlots } from 'vue'
import KunToolbarTitle from './KunToolbarTitle.vue'

const props = defineProps({
    absolute: Boolean,
    bgColor: String,
    titlePosition: { type: String, default: 'left' },
    bordered: { type: Boolean, default: false },
    borderColor: String,
    collapse: Boolean,
    density: { type: String, default: 'default' },
    elevation: [String, Number],
    extended: Boolean,
    extensionHeight: {
        type: [String, Number],
        default: 48,
    },
    flat: Boolean,
    floating: Boolean,
    height: [String, Number],
    image: String,
    rounded: [String, Boolean],
    tag: { type: String, default: 'header' },
    theme: String,
    tile: Boolean,
    title: String,
})

const slots = useSlots()
const contentRef = ref(null)
const extensionRef = ref(null)

const hasExtension = computed(() => props.extended || !!slots.extension)

const densityClass = computed(() => {
  switch (props.density) {
    case 'prominent': return 'min-h-[96px]'
    case 'comfortable': return 'min-h-[56px]'
    case 'compact': return 'min-h-[48px]'
    default: return 'min-h-[64px]'
  }
})

const heightClass = computed(() => 
    props.height ? typeof props.height === 'number' ? `h-[${props.height}px]` : props.height : ''
)

const elevationClass = computed(() =>
  props.elevation ? `shadow-[${props.elevation}]` : ''
)

const roundedClass = computed(() => {
  if (props.tile) return 'rounded-none'
  if (props.rounded === true) return 'rounded'
  if (typeof props.rounded === 'string') return props.rounded
  return ''
})

const mergedClass = computed(() => 
    props.bgColor ? props.bgColor : 'bg-transparent',
    props.floating ? 'inline-flex' : '',
    props.flat ? '' : `shadow-md`,
    props.absolute ? 'absolute inset-0' : '',
    roundedClass.value,
    props.bordered ? props.borderColor : 'border-b border-slate-200 dark:border-slate-800',
    heightClass.value,
    elevationClass.value
)
</script>
