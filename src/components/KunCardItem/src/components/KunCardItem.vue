<template>
    <div class="w-full" :class="containerClass" :style="containerStyle">
        <slot />
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useCardItem } from '../composables/useCardItem'
import { kunCardItemProps } from '../composables/kunCardItemProps'

const props = defineProps(kunCardItemProps)

const {
    containerClass,
    containerStyle
} = useCardItem(props)
</script>
