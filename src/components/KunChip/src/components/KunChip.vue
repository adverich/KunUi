<template>
  <component :is="componentTag" v-bind="componentAttrs" :class="chipClass" :style="chipStyle"
    :disabled="isLink ? undefined : (disabled ? '' : undefined)" @click.stop>
    <!-- Prepend Icon -->
    <KunIcon v-if="prependIcon" :icon="prependIcon" class="mr-1 flex-shrink-0" />

    <!-- Slot prepend-icon -->
    <slot name="prepend">
      <span v-if="$slots.prepend" class="mr-1"></span>
    </slot>

    <!-- Label o Texto -->
    <span class="truncate">{{ label || text }}</span>

    <!-- Contenido slot por defecto -->
    <slot v-if="$slots.default && !(label || text)" />

    <!-- Append Icon -->
    <KunIcon v-if="appendIcon" :icon="appendIcon" class="ml-1 flex-shrink-0" />

    <!-- Slot append-icon -->
    <slot name="append" v-else-if="$slots.append" class="ml-1" />

    <!-- Botón de cerrar -->
    <KunIcon v-if="closable && modelValue" :icon="'$mdi-close'" class="ml-1 flex-shrink-0 cursor-pointer"
      @click="handleClose" />
  </component>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useChip } from '../composables/useChip'
import { kunChipProps } from '../composables/kunChipProps'
import KunIcon from '../../../KunIcon/src/components/KunIcon.vue'

const props = defineProps(kunChipProps)
const emit = defineEmits(['update:modelValue', 'click:close'])

const {
  componentTag,
  componentAttrs,
  chipClass,
  chipStyle,
  handleClose
} = useChip(props, emit)
</script>