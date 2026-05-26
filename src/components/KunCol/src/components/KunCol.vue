<template>
  <div :class="colClasses" :style="colStyles" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup>
import { computed, inject, unref } from 'vue'

const normalizeSpan = (value, fallback) => {
  const parsedValue = Number.parseInt(value, 10)

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return fallback
  }

  return parsedValue
}

const props = defineProps({
  cols: [String, Number],
  sm: [String, Number],
  md: [String, Number],
  lg: [String, Number],
  xl: [String, Number],
})

const noGutters = inject('noGutters', false)
const dense = inject('dense', false)
const rowCols = inject('rowCols', 12)

const colClasses = computed(() => {
  const classes = []

  if (!noGutters) {
    classes.push(dense ? 'p-1' : 'p-2')
  }

  classes.push('kun-col')

  return classes
})

const colSpans = computed(() => {
  const fullRowSpan = normalizeSpan(unref(rowCols), 12)
  const base = normalizeSpan(props.cols, fullRowSpan)
  const sm = normalizeSpan(props.sm, base)
  const md = normalizeSpan(props.md, sm)
  const lg = normalizeSpan(props.lg, md)
  const xl = normalizeSpan(props.xl, lg)

  return { base, sm, md, lg, xl }
})

const colStyles = computed(() => {
  return {
    '--kun-col-span': colSpans.value.base,
    '--kun-col-span-sm': colSpans.value.sm,
    '--kun-col-span-md': colSpans.value.md,
    '--kun-col-span-lg': colSpans.value.lg,
    '--kun-col-span-xl': colSpans.value.xl,
  }
})
</script>

<style scoped>
.kun-col {
  grid-column: span var(--kun-col-span) / span var(--kun-col-span);
  min-width: 0;
}

@media (min-width: 40rem) {
  .kun-col {
    grid-column: span var(--kun-col-span-sm) / span var(--kun-col-span-sm);
  }
}

@media (min-width: 48rem) {
  .kun-col {
    grid-column: span var(--kun-col-span-md) / span var(--kun-col-span-md);
  }
}

@media (min-width: 64rem) {
  .kun-col {
    grid-column: span var(--kun-col-span-lg) / span var(--kun-col-span-lg);
  }
}

@media (min-width: 80rem) {
  .kun-col {
    grid-column: span var(--kun-col-span-xl) / span var(--kun-col-span-xl);
  }
}
</style>
