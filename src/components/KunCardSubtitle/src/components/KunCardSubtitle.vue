<template>
    <div class="text-sm text-gray-500 font-normal" :class="subtitleClass" :style="subtitleStyle">
        <slot>{{ subtitle }}</slot>
    </div>
</template>

<script setup>
import { useCardSubtitle } from '../composables/useCardSubtitle'
import { kunCardSubtitleProps } from '../composables/kunCardSubtitleProps'
import { defineProps } from 'vue'

const props = defineProps(kunCardSubtitleProps)

const {
    subtitleClass,
    subtitleStyle
} = useCardSubtitle(props)
</script>
