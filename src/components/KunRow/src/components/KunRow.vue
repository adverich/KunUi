<template>
  <div :class="rowClasses" :style="customStyle">
    <slot />
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  noGutters: {
    type: Boolean,
    default: false
  },
  align: {
    type: String,
    default: null, // center, start, end, stretch
    validator: v => ['start', 'center', 'end', 'stretch', null].includes(v)
  },
  justify: {
    type: String,
    default: null, // start, center, end, space-between, space-around
    validator: v => ['start', 'center', 'end', 'space-between', 'space-around', null].includes(v)
  },
  dense: {
    type: Boolean,
    default: false
  },
  direction: {
    type: String,
    default: null, // row, row-reverse
    validator: v => ['row', 'row-reverse', null].includes(v)
  },
  class: {
    type: [String, Array, Object],
    default: null
  },
  style: {
    type: Object,
    default: null
  }
})

// Generar clases dinámicas según props
const rowClasses = computed(() => {
  const classes = ['flex', 'flex-wrap']

  // Dirección
  if (props.direction === 'row-reverse') classes.push('flex-row-reverse')
  else classes.push('flex-row')

  // Alineación vertical
  if (props.align === 'center') classes.push('items-center')
  else if (props.align === 'start') classes.push('items-start')
  else if (props.align === 'end') classes.push('items-end')
  else if (props.align === 'stretch') classes.push('items-stretch')

  // Alineación horizontal
  if (props.justify === 'center') classes.push('justify-center')
  else if (props.justify === 'end') classes.push('justify-end')
  else if (props.justify === 'start') classes.push('justify-start')
  else if (props.justify === 'space-between') classes.push('justify-between')
  else if (props.justify === 'space-around') classes.push('justify-around')

  // Padding (gutters)
  if (!props.noGutters) {
    if (props.dense) {
      classes.push('-mx-1')
    } else {
      classes.push('-mx-4')
    }
  }

  // Clases personalizadas pasadas por usuario
  if (props.class) {
    if (Array.isArray(props.class)) {
      classes.push(...props.class)
    } else if (typeof props.class === 'string') {
      classes.push(...props.class.split(' '))
    } else if (typeof props.class === 'object') {
      Object.entries(props.class).forEach(([key, value]) => {
        if (value) classes.push(key)
      })
    }
  }

  return classes
})

// Pasar estilo inline opcional
const customStyle = computed(() => {
  return props.style || {}
})
</script>