<template>
  <div
    class="fixed inset-0 bg-black/50 transition-opacity duration-300"
    @click="onClick"
  />
</template>

<script setup>
import { kunDialogOverlayProps } from '../composables/kunDialogOverlayProps'

const props = defineProps(kunDialogOverlayProps)

const emit = defineEmits(['click'])

const onClick = () => {
  if (!props.persistent) emit('click')
}
</script>
