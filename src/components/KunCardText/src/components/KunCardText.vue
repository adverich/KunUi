<template>
    <div class="block" :class="textClass" :style="textStyle">
        <slot>{{ text }}</slot>
    </div>
</template>

<script setup>
import { useCardText } from '../composables/useCardText'
import { kunCardTextProps } from '../composables/kunCardTextProps'

const props = defineProps(kunCardTextProps)

const {
    textClass,
    textStyle
} = useCardText(props)
</script>
