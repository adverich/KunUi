<template>
  <div :class="colClasses">
    <slot />
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'

const props = defineProps({
  cols: [Number, String],
  sm: [Number, String],
  md: [Number, String],
  lg: [Number, String],
  xl: [Number, String],
})

const noGutters = inject('noGutters', false)
const dense = inject('dense', false)

// Convierte número (1-12) a fracción Tailwind: '1/12', '1/2', etc.
const toFraction = (val) => {
  const num = parseInt(val)
  const fractions = {
    1: '1/12',
    2: '2/12',
    3: '1/4',
    4: '1/3',
    5: '5/12',
    6: '1/2',
    7: '7/12',
    8: '2/3',
    9: '3/4',
    10: '5/6',
    11: '11/12',
    12: 'full',
  }
  return fractions[num] || 'full'
}

const colClasses = computed(() => {
  const classes = []

  if (!noGutters) {
    classes.push(dense ? 'p-1' : 'p-2')
  }

  const sizes = ['cols', 'sm', 'md', 'lg', 'xl']
  const prefixes = {
    cols: '', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl',
  }

  sizes.forEach(size => {
    const val = props[size]
    if (val) {
      const fraction = toFraction(val)
      const prefix = prefixes[size]
      const cls = prefix ? `${prefix}:w-${fraction}` : `w-${fraction}`
      classes.push(cls)
    }
  })

  const classString = classes.join(' ')
  console.log('colClasses', classString)
  return classString;
})
</script>

