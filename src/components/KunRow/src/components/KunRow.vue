<template>
  <div :class="rowClasses">
    <slot />
  </div>
</template>

<script setup>
import { computed, provide } from 'vue'

const props = defineProps({
  noGutters: Boolean,
  dense: Boolean,
  align: String,
  justify: String,
  direction: String,
})

const rowClasses = computed(() => {
  const classes = ['flex', 'flex-wrap']

  classes.push(props.direction === 'row-reverse' ? 'flex-row-reverse' : 'flex-row')

  if (!props.noGutters) {
    classes.push(props.dense ? '-mx-1' : '-mx-2') // simula gutters como Vuetify
  }

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

provide('noGutters', props.noGutters)
provide('dense', props.dense)
</script>
