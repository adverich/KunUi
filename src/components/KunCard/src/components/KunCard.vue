<template>
    <div class="w-full" :class="cardClass" :style="cardStyle">
        <!-- Header -->
        <div v-if="$slots.title || title">
            <KunCardItem dense>
                <KunCardTitle :title="title" :subtitle="subtitle" />
            </KunCardItem>
        </div>

        <!-- Contenido -->
        <div v-if="$slots.default || text">
            <KunCardItem v-if="text">
                <KunCardText :text="text" />
            </KunCardItem>
            <slot v-else />
        </div>

        <!-- Acciones -->
        <div v-if="$slots.actions">
            <KunCardActions>
                <slot name="actions" />
            </KunCardActions>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useCard } from '../composables/useCard'
import { kunCardProps } from '../composables/kunCardProps'

import KunCardItem from '../../../KunCardItem/src/components/KunCardItem.vue'
import KunCardTitle from '../../../KunCardTitle/src/components/KunCardTitle.vue'
import KunCardSubtitle from '../../../KunCardSubtitle/src/components/KunCardSubtitle.vue'
import KunCardText from '../../../KunCardText/src/components/KunCardText.vue'
import KunCardActions from '../../../KunCardActions/src/components/KunCardActions.vue'

const props = defineProps(kunCardProps)

const {
    cardClass,
    cardStyle
} = useCard(props)
</script>
