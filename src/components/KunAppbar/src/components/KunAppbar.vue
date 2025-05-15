<template>
  <header
    class="flex items-center px-4 w-full"
    :class="[heightClass, bgColor, elevationClass, bordered ? 'border-b border-gray-200' : '']"
  >
    <!-- IZQUIERDA: Drawer + prepend -->
    <div class="flex items-center gap-2">
      <slot name="appbarButton">
        <button
          v-if="showDrawerButton"
          class="p-2 rounded-md hover:bg-white/10 transition"
          @click="$emit('toggle-drawer')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </slot>

      <slot name="prepend" />

      <KunAppbarTitle
        v-if="title && titlePosition === 'left'"
        :title="title"
        :titleImage="titleImage"
        :textSize="titleSize"
        :fontWeight="titleWeight"
      />
    </div>

    <!-- CENTRO -->
    <div v-if="title && titlePosition === 'center'" class="flex-1 flex justify-center">
      <KunAppbarTitle
        :title="title"
        :titleImage="titleImage"
        :textSize="titleSize"
        :fontWeight="titleWeight"
      />
    </div>

    <!-- DERECHA -->
    <div v-if="title && titlePosition === 'right'" class="flex-1 flex justify-end">
      <KunAppbarTitle
        :title="title"
        :titleImage="titleImage"
        :textSize="titleSize"
        :fontWeight="titleWeight"
      />
    </div>

    <!-- ACCIONES -->
    <div class="flex items-center gap-2 ml-auto">
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import KunAppbarTitle from '../../../KunAppbarTitle/src/components/KunAppbarTitle.vue'

const props = defineProps({
  bgColor: {
    type: String,
    default: 'bg-transparent'
  },
  title: {
    type: String,
    default: ''
  },
  titleImage: {
    type: String,
    default: ''
  },
  titleSize: {
    type: String,
    default: 'text-base'
  },
  titleWeight: {
    type: String,
    default: 'font-medium'
  },
  titlePosition: {
    type: String,
    default: 'center',
    validator: val => ['left', 'center', 'right'].includes(val)
  },
  density: {
    type: String,
    default: 'default'
  },
  elevation: {
    type: String,
    default: 'md'
  },
  bordered: {
    type: Boolean,
    default: false
  },
  showDrawerButton: {
    type: Boolean,
    default: true
  }
})

const heightClass = computed(() => {
  switch (props.density) {
    case 'comfortable':
      return 'h-12 py-1'
    case 'compact':
      return 'h-10 py-0.5'
    default:
      return 'h-14 py-2'
  }
})

const elevationClass = computed(() => {
  const allowed = ['sm', 'md', 'lg', 'xl', '2xl']
  return props.elevation === 'none' || !allowed.includes(props.elevation)
    ? ''
    : `shadow-${props.elevation}`
})
</script>
