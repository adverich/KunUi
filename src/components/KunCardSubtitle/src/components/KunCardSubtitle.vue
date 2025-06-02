<template>
    <div :class="computedClass" v-bind="$attrs">
        <slot>{{ subtitle }}</slot>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { kunCardSubtitleProps } from '../composables/kunCardSubtitleProps'

const props = defineProps(kunCardSubtitleProps)

const computedClass = computed(() => {
    return [
        props.color,
        props.dense ? 'text-xs' : 'text-sm',
        props.fontWeight
    ].filter(Boolean)
})
</script>
