<template>
  <div :class="mergedClasses">
    <slot />
  </div>
</template>

<script setup>
import { useAttrs, computed, provide } from 'vue'
const attrs = useAttrs()

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
    type: String,
    default: '12', // total de columnas del grid
  }
})

provide('noGutters', props.noGutters)
provide('dense', props.dense)

const rowClasses = computed(() => {
  const classes = ['grid', `grid-cols-${props.cols}`];

  if (!props.noGutters) {
    classes.push(props.dense ? '' : 'gap-4')
  }

  // opcional, si querés alinear contenido vertical/horizontal
  if (props.align) {
    classes.push({
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    }[props.align])
  }

  if (props.justify) {
    classes.push({
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      'space-between': 'justify-between',
      'space-around': 'justify-around',
    }[props.justify])
  }

  return classes
})

const mergedClasses = computed(() => {
  const userClasses = attrs.class ?? 'w-full'
  return [...rowClasses.value, userClasses].join(' ')
})
</script>
