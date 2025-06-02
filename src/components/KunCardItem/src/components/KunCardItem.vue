<template>
    <div class="w-full" :class="containerClass">
        <slot />
    </div>
</template>

<script setup>
import { computed, useAttrs } from 'vue'
import { kunCardItemProps } from '../composables/kunCardItemProps'

const props = defineProps(kunCardItemProps)
const attrs = useAttrs()

const containerClass = computed(() => {
    return [
        'flex',
        'flex-col',
        props.dense ? 'py-1 px-2' : 'py-3 px-4',
        props.gap,
        attrs.class
    ].filter(Boolean)
})
</script>
