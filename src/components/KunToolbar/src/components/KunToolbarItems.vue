<template>
  <div
    class="inline-flex gap-2 items-center"
    :class="[colorClass, variantClass]"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  color: String,
  variant: {
    type: String,
    default: 'text',
    validator: (v) =>
      ['flat', 'text', 'elevated', 'tonal', 'outlined', 'plain'].includes(v),
  },
})

const colorClass = computed(() =>
  props.color ? `bg-${props.color}` : ''
)

const variantClass = computed(() => {
  switch (props.variant) {
    case 'flat':
      return 'bg-transparent shadow-none'
    case 'text':
      return 'bg-transparent'
    case 'elevated':
      return 'shadow-md'
    case 'tonal':
      return 'bg-gray-100 text-gray-800'
    case 'outlined':
      return 'border border-gray-300'
    case 'plain':
      return ''
    default:
      return ''
  }
})
</script>
