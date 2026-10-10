<template>
  <div :class="rowClasses" :style="rowStyles" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'

const DEFAULT_COLS = 12

const normalizeCols = (value: unknown): number => {
  const parsedValue = Number.parseInt(String(value), 10)

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return DEFAULT_COLS
  }

  return parsedValue
}

const props = defineProps({
  noGutters: {
    type: Boolean,
    default: false,
  },
  dense: {
    type: Boolean,
    default: true,
  },
  align:  {
    type: String,
    default: 'center',
  },
  justify: {
    type: String,
    default: 'space-around',
  },
  cols: {
    type: [String, Number],
    default: DEFAULT_COLS,
  }
})

provide('noGutters', props.noGutters)
provide('dense', props.dense)
const resolvedCols = computed(() => normalizeCols(props.cols))
provide('rowCols', resolvedCols)

const rowClasses = computed(() => {
  const classes: (string | undefined)[] = []

  if (!props.noGutters) {
    classes.push(props.dense ? '' : 'gap-4')
  }

  // opcional, si querés alinear contenido vertical/horizontal
  if (props.align) {
    classes.push(({
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    } as Record<string, string>)[props.align as string])
  }

  if (props.justify) {
    classes.push(({
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      'space-between': 'justify-between',
      'space-around': 'justify-around',
    } as Record<string, string>)[props.justify as string])
  }

  return classes
})

const rowStyles = computed(() => {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${resolvedCols.value}, minmax(0, 1fr))`,
  }
})
</script>

