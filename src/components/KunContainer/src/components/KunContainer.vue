<template>
  <div :class="containerClasses" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  fluid: {
    type: Boolean,
    default: false
  }
})

// Determinar las clases condicionales
const containerClasses = computed(() => {
  const baseClasses = ['w-full', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8']

  if (!props.fluid) {
    // Si no es fluid, aplicamos anchos máximos responsivos
    baseClasses.push(
      'max-w-screen-sm',
      'sm:max-w-screen-md',
      'md:max-w-screen-lg',
      'lg:max-w-screen-xl',
      'xl:max-w-screen-2xl'
    )
  }

  // Agregar clases personalizadas pasadas por props
  if (props.class) {
    if (Array.isArray(props.class)) {
      baseClasses.push(...props.class)
    } else if (typeof props.class === 'string') {
      baseClasses.push(...props.class.split(' '))
    } else if (typeof props.class === 'object') {
      Object.entries(props.class).forEach(([key, value]) => {
        if (value) baseClasses.push(key)
      })
    }
  }

  return baseClasses
})
</script>