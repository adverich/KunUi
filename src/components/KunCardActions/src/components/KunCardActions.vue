<template>
    <div class="w-full" :class="containerClass" :style="containerStyle">
        <slot />
    </div>
</template>

<script setup>
import { useCardActions } from '../composables/useCardActions'
import { kunCardActionsProps } from '../composables/kunCardActionsProps'

const props = defineProps(kunCardActionsProps)

const {
    containerClass,
    containerStyle
} = useCardActions(props)
</script>
