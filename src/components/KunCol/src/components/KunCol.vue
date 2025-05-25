<template>
  <div :class="colClasses">
    <slot />
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'

const props = defineProps({
  cols: String,
  sm: String,
  md: String,
  lg: String,
  xl: String,
})

const noGutters = inject('noGutters', false)
const dense = inject('dense', false)

const colClasses = computed(() => {
  const classes = []

  if (!noGutters) {
    classes.push(dense ? 'p-1' : 'p-2')
  }

  const sizes = ['cols', 'sm', 'md', 'lg', 'xl']
  const prefixes = {
    cols: '', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl',
  }

  let lastVal = '0';
  sizes.forEach(size => {
    const val = props[size];
    if (val) {
      const prefix = prefixes[size];
      const cls = prefix ? `${prefix}:col-span-${val}` : `col-span-${val}`;
      classes.push(cls)
      lastVal = val;
    } else {
      const prefix = prefixes[size];
      const cls = `${prefix}:col-span-${lastVal}`;
      classes.push(cls)
    }
  })

  const res = [...classes].join(' ');
  return res;
})
</script>
