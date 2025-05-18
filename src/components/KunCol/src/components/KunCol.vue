<template>
  <div :class="colClasses" :style="customStyle">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  cols: {
    type: [String, Number, Boolean],
    default: false
  },
  sm: { type: [String, Number], default: null },
  md: { type: [String, Number], default: null },
  lg: { type: [String, Number], default: null },
  xl: { type: [String, Number], default: null },
  offset: { type: [String, Number], default: null },
  smOffset: { type: [String, Number], default: null },
  mdOffset: { type: [String, Number], default: null },
  lgOffset: { type: [String, Number], default: null },
  xlOffset: { type: [String, Number], default: null },
  order: { type: [String, Number], default: null },
  alignSelf: {
    type: String,
    default: null,
    validator: v => ['start', 'center', 'end', 'auto', null].includes(v)
  },
  class: { type: [String, Array, Object], default: null },
  style: { type: Object, default: null }
})

// Función auxiliar para calcular ancho en base a cols
const getWidthClass = (value) => {
  if (value === true || value === '') return 'grow'
  const width = parseInt(value)
  if (isNaN(width)) return ''
  return `w-${width * 1 / 12 * 100}%`
}

// Calcular clases dinámicas
const colClasses = computed(() => {
  const classes = []

  // Padding si no hay noGutters en el row
  classes.push('px-4') // o usar dynamic class desde prop

  // Ancho base
  if (props.cols) {
    if (props.cols === 'auto') {
      classes.push('grow')
    } else {
      const width = parseInt(props.cols)
      if (!isNaN(width)) {
        classes.push(`w-${width * 8.33333333}%`)
      }
    }
  } else {
    classes.push('grow')
  }

  // Responsive widths
  if (props.sm) classes.push(`sm:w-${parseInt(props.sm) * 8.33333333}%`)
  if (props.md) classes.push(`md:w-${parseInt(props.md) * 8.33333333}%`)
  if (props.lg) classes.push(`lg:w-${parseInt(props.lg) * 8.33333333}%`)
  if (props.xl) classes.push(`xl:w-${parseInt(props.xl) * 8.33333333}%`)

  // Offset
  if (props.offset) classes.push(`ml-${parseInt(props.offset) * 8.33333333}%`)
  if (props.smOffset) classes.push(`sm:ml-${parseInt(props.smOffset) * 8.33333333}%`)
  if (props.mdOffset) classes.push(`md:ml-${parseInt(props.mdOffset) * 8.33333333}%`)
  if (props.lgOffset) classes.push(`lg:ml-${parseInt(props.lgOffset) * 8.33333333}%`)
  if (props.xlOffset) classes.push(`xl:ml-${parseInt(props.xlOffset) * 8.33333333}%`)

  // Order
  if (props.order) classes.push(`order-${props.order}`)

  // Auto margin o alineación
  if (props.alignSelf === 'start') classes.push('self-start')
  else if (props.alignSelf === 'center') classes.push('self-center')
  else if (props.alignSelf === 'end') classes.push('self-end')

  // Clases personalizadas
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

const customStyle = computed(() => {
  return props.style || {}
})
</script>