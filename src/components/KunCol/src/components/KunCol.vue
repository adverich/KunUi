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
    '--kun-col-grid-column': `span ${colSpans.value.base} / span ${colSpans.value.base}`,
    '--kun-col-grid-column-sm': `span ${colSpans.value.sm} / span ${colSpans.value.sm}`,
    '--kun-col-grid-column-md': `span ${colSpans.value.md} / span ${colSpans.value.md}`,
    '--kun-col-grid-column-lg': `span ${colSpans.value.lg} / span ${colSpans.value.lg}`,
    '--kun-col-grid-column-xl': `span ${colSpans.value.xl} / span ${colSpans.value.xl}`,
  }
})
</script>

<style scoped>
.kun-col {
  grid-column: var(--kun-col-grid-column);
  min-width: 0;
}

@media (min-width: 40rem) {
  .kun-col {
    grid-column: var(--kun-col-grid-column-sm);
  }
}

@media (min-width: 48rem) {
  .kun-col {
    grid-column: var(--kun-col-grid-column-md);
  }
}

@media (min-width: 64rem) {
  .kun-col {
    grid-column: var(--kun-col-grid-column-lg);
  }
}

@media (min-width: 80rem) {
  .kun-col {
    grid-column: var(--kun-col-grid-column-xl);
  }
}
</style>
