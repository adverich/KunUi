<template>
    <div class="w-full" :class="containerClass"  v-bind="$attrs">
        <slot />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { kunCardItemProps } from '../composables/kunCardItemProps'

const props = defineProps(kunCardItemProps)

const containerClass = computed(() => {
    return [
        'flex',
        'flex-col',
        props.dense ? 'py-1 px-2' : 'py-3 px-4',
        props.gap
    ].filter(Boolean)
})
</script>
