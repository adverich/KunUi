<template>
    <div :class="computedClass" v-bind="$attrs">
        <slot>{{ subtitle }}</slot>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { kunCardSubtitleProps } from '../composables/kunCardSubtitleProps.js'

const props = defineProps(kunCardSubtitleProps)

const computedClass = computed(() => {
    return [
        props.color,
        props.dense ? 'text-xs' : 'text-sm',
        props.fontWeight
    ].filter(Boolean)
})
</script>

