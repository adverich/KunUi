<template>
    <div class="block" :class="textClass">
        <slot>{{ text }}</slot>
    </div>
</template>

<script setup>
import { computed, useAttrs } from 'vue'
import { kunCardTextProps } from '../composables/kunCardTextProps'

const props = defineProps(kunCardTextProps)
const attrs = useAttrs()

const textClass = computed(() => {
    return [
        props.color,
        props.dense ? 'text-xs' : 'text-sm',
        attrs.class
    ].filter(Boolean)
})
</script>
