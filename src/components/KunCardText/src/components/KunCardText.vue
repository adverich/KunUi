<template>
    <component :is="tag" class="block" :class="computedClass" v-bind="$attrs">
        <slot>{{ text }}</slot>
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { kunCardTextProps } from '../composables/kunCardTextProps.js'

const props = defineProps(kunCardTextProps)

const computedClass = computed(() => {
    return [
        props.color, 
        props.opacity, 
        props.dense ? 'text-xs' : 'text-sm'
    ].filter(Boolean)
})
</script>

