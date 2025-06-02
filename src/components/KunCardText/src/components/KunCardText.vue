<template>
    <div class="block" :class="textClass" v-bind="$attrs">
        <slot>{{ text }}</slot>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { kunCardTextProps } from '../composables/kunCardTextProps'

const props = defineProps(kunCardTextProps)

const textClass = computed(() => {
    return [
        props.color,
        props.dense ? 'text-xs' : 'text-sm'
    ].filter(Boolean)
})
</script>
