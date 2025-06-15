<template>
  <div
    class="fixed inset-0 bg-black/50 transition-opacity duration-300"
    @click="onClick"
  />
</template>

<script setup lang="ts">
const props = defineProps({
  persistent: Boolean,
})

const emit = defineEmits(['click'])

const onClick = () => {
  if (!props.persistent) emit('click')
}
</script>
