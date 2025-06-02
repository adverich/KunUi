<template>
    <div :class="computedClass">
        <slot>{{ subtitle }}</slot>
    </div>
</template>

<script setup>
import { computed, useAttrs } from 'vue'
import { kunCardSubtitleProps } from '../composables/kunCardSubtitleProps'

const props = defineProps(kunCardSubtitleProps)
const attrs = useAttrs()

const computedClass = computed(() => {
    return [
        props.color,
        props.dense ? 'text-xs' : 'text-sm',
        props.fontWeight,
        attrs.class
    ].filter(Boolean)
})
</script>
