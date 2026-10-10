<template>
  <div
    class="fixed inset-0 bg-ui-overlay transition-opacity duration-300"
    @click="onClick"
  />
</template>

<script setup lang="ts">
import { kunDialogOverlayProps } from '../composables/kunDialogOverlayProps.js'

const props = defineProps(kunDialogOverlayProps)

const emit = defineEmits(['click'])

const onClick = () => {
  if (!props.persistent) emit('click')
}
</script>

