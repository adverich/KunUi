<template>
  <div
    class="inline-flex gap-2 items-center"
    :class="surfaceClass"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { kunToolbarItemsProps } from '../composables/kunToolbarItemsProps.js'
import { KUN_SURFACE_BG, resolveKunColor, resolveKunVariant, type KunColor, type KunVariant } from '../../../../theme/kunVariants.js'

const props = defineProps(kunToolbarItemsProps)

// ------------------------------------------------------------------
// Superficie (única capa de fondo + ring del contenedor de ítems),
// resolución estándar: prop > theme.defaults['toolbar-items'] > default.
// ------------------------------------------------------------------
const resolvedColor = computed<KunColor>(() => resolveKunColor(props.color, 'toolbar-items'))
const resolvedVariant = computed<KunVariant>(() => resolveKunVariant(props.variant, 'toolbar-items'))
const surfaceClass = computed(() => KUN_SURFACE_BG[resolvedColor.value][resolvedVariant.value])
</script>
