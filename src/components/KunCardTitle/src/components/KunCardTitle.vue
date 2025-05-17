<template>
    <div :class="containerClass" :style="containerStyle">
        <!-- Slot prepend -->
        <div v-if="$slots.prepend || hasPrependIcon" class="flex items-center justify-center w-6 h-6 mx-2">
            <slot name="prepend">
                <KunIcon v-if="hasPrependIcon" :icon="prepend" />
            </slot>
        </div>

        <!-- Contenido -->
        <div class="flex items-center w-full flex-grow truncate">
            <h3 :class="titleClass">
                <slot>{{ title }}</slot>
            </h3>

            <!-- Subtítulo opcional -->
            <div v-if="subtitle" :class="subtitleClass">
                {{ subtitle }}
            </div>
        </div>

        <!-- Slot append -->
        <div v-if="$slots.append || hasAppendIcon" class="flex items-center justify-center w-6 h-6 mx-2">
            <slot name="append">
                <KunIcon v-if="hasAppendIcon" :icon="append" />
            </slot>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useCardTitle } from '../composables/useCardTitle'
import { kunCardTitleProps } from '../composables/kunCardTitleProps'
import KunIcon from '../../../KunIcon/src/components/KunIcon.vue'

const props = defineProps(kunCardTitleProps)

const {
    hasPrependIcon,
    hasAppendIcon,
    containerClass,
    containerStyle,
    titleClass,
    subtitleClass
} = useCardTitle(props)
</script>
