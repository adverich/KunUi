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
        'px-2',
      ]"
    >
      <div :class="[leftSectionClass, titleMaxWidth]">
        <!-- Prepend -->
        <slot name="prepend" />

        <!-- Título izquierda -->
        <div v-if="titlePosition === 'left'" class="truncate">
          <slot name="title">
            <KunToolbarTitle v-if="title" :text="title" />
          </slot>
        </div>
      </div>

      <!-- Contenido principal -->
      <slot />

      <div v-if="titlePosition === 'center'" class="flex justify-center items-center truncate" :class="titleMaxWidth">
        <slot name="title">
          <KunToolbarTitle v-if="title" :text="title" />
        </slot>
      </div>

      <div :class="[rightSectionClass, titleMaxWidth]">
        <!-- Toolbar Items -->
        <slot name="items" />

        <div v-if="titlePosition === 'right'" class="truncate">
          <slot name="title">
            <KunToolbarTitle v-if="title" :text="title" />
          </slot>
        </div>

        <!-- Append -->
        <slot name="append" />
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
import { kunToolbarProps } from '../composables/kunToolbarProps'

const props = defineProps(kunToolbarProps)

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
