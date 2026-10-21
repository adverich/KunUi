<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import KunIcon from '@/components/KunIcon/src/components/KunIcon.vue'
import { useCheckboxModel } from '../composables/useCheckboxModel.js'
import { useValidation } from '../composables/useValidation.js'
import { kunCheckboxProps } from '../composables/kunCheckboxProps.js'
import { vRipple } from '@/directives/ripple.js'
import { icons } from '@/icons'

const emit = defineEmits([
  'update:modelValue',
  'update:focused',
  'click:append',
  'click:prepend'
])

const props = defineProps(kunCheckboxProps)

const isFocused = ref(props.focused ?? false)
watch(() => props.focused, v => isFocused.value = v)

const {
  isChecked,
  toggle,
  internalValue
} = useCheckboxModel(props, emit)

const {
  errorMessages,
  isValid,
  validate,
  resetValidation
} = useValidation(props, internalValue)

defineExpose({ validate, resetValidation })

const iconToRender = computed(() => {
  if (props.indeterminate) return props.indeterminateIcon || icons.minus
  return isChecked.value
    ? (props.trueIcon || icons.check)
    : (props.falseIcon || null)
})

/** `iconColor` solo tiene efecto con un string no vacío (el default es `undefined`). */
const hasIconColor = computed(
  () => typeof props.iconColor === 'string' && props.iconColor.trim().length > 0,
)

/**
 * Caja del control: contorno `ring ring-inset ring-accented`; inactiva usa
 * `bg-elevated` para que se lea sobre fondos oscuros (en dark `bg-default` se
 * confunde con la página). Activa: `color` libre del consumidor; con
 * `iconColor` la caja queda neutra para que el glifo coloreado contraste; por
 * defecto `bg-primary text-highlighted`.
 */
const boxClass = computed(() => {
  const active = isChecked.value || props.indeterminate
  const classes = ['ring-1', 'ring-inset', 'rounded-sm', 'ring-accented']

  if (active) {
    if (props.color) {
      classes.push(props.color)
    } else if (hasIconColor.value) {
      classes.push('bg-elevated')
    } else {
      classes.push('bg-primary', 'text-highlighted')
    }
  } else {
    classes.push(props.baseColor || 'bg-elevated')
  }

  if (props.error || !isValid.value) classes.push('ring-error')
  return classes
})

const iconInnerSizeClass = computed(() => ({
  sm: 'w-3 h-3',
  md: 'w-3.5 h-3.5',
  lg: 'w-4 h-4'
}[effectiveSize.value] || 'w-3.5 h-3.5'))

const iconClass = computed(() => {
  const color = hasIconColor.value
    ? (props.iconColor as string).trim().replace(/^text-/, '')
    : ''
  return [
    color ? `text-${color}` : '',
    props.glow && isFocused.value ? 'drop-shadow-[0_0_5px_currentColor]' : '',
  ]
})

// Escala de tamaño por densidad (como KunAvatar): comfortable -1, compact -2, piso en sm.
const sizeOrder = ['sm', 'md', 'lg']
const densityOffset: Record<string, number> = { compact: -2, comfortable: -1, default: 0 }
const effectiveSize = computed(() => {
  const i = sizeOrder.indexOf(props.size as string)
  if (i < 0) return props.size as string
  return sizeOrder[Math.max(0, i + (densityOffset[String(props.density)] ?? 0))]
})

const iconSizeClass = computed(() => ({
  sm: 'w-4 h-4 text-sm',
  md: 'w-5 h-5 text-base',
  lg: 'w-6 h-6 text-lg'
}[effectiveSize.value] || props.size)) // permite string personalizada tipo "w-6 h-6"
</script>

<template>
  <div
    :class="[
      'kun-checkbox',
      'flex flex-col',
      { 'text-error': props.error || !isValid }
    ]"
    :style="{
      width: props.width && `${props.width}px`,
      minWidth: props.minWidth && `${props.minWidth}px`,
      maxWidth: props.maxWidth && `${props.maxWidth}px`
    }"
    v-bind="$attrs"
  >
    <input
      v-if="props.name"
      type="checkbox"
      :name="props.name"
      :checked="isChecked"
      :value="props.value ?? props.trueValue"
      class="hidden"
    />

    <div
      :class="[
        'flex gap-2',
        direction === 'vertical' ? 'flex-col items-start' : 'flex-row items-center',
        {
          'cursor-pointer': !props.disabled && !props.readonly,
          'opacity-50 pointer-events-none': props.disabled || props.readonly,
        }
      ]"
      role="checkbox"
      :aria-checked="props.indeterminate ? 'mixed' : isChecked"
      :aria-disabled="props.disabled"
      :tabindex="props.disabled ? -1 : 0"
      @click="toggle"
      @focus="() => { isFocused = true; emit('update:focused', true) }"
      @blur="() => { isFocused = false; emit('update:focused', false); if (props.validateOn?.includes('blur')) validate() }"
      @keydown.space.prevent="toggle"
    >
      <div class="flex gap-2" :class="props.centerAffix ? 'items-center' : 'items-start'" @click.stop="$emit('click:prepend')">
        <slot name="prepend" />
        <KunIcon v-if="props.prependIcon" :icon="props.prependIcon" />
      </div>

      <div
        class="relative inline-flex items-center justify-center transition-colors"
        :class="[iconSizeClass, boxClass]"
        v-ripple="props.ripple"
      >
        <KunIcon v-if="iconToRender" :icon="iconToRender" :class="[...iconClass, iconInnerSizeClass]" />
        <slot name="input" />
      </div>

      <div v-if="props.label || $slots.label">
        <slot name="label" :label="props.label">{{ props.label }}</slot>
      </div>

      <div class="flex gap-2" :class="props.centerAffix ? 'items-center' : 'items-start'" @click.stop="$emit('click:append')">
        <slot name="append" />
        <KunIcon v-if="props.appendIcon" :icon="props.appendIcon" />
      </div>
    </div>

    <div
      v-if="!props.hideDetails && (errorMessages?.length || props.hint || props.persistentHint)"
      class="text-xs text-muted mt-1"
    >
      <slot name="details">
        <div v-if="(props.error || !isValid) && errorMessages?.length">
          <slot name="message" v-for="msg in errorMessages.slice(0, Number(props.maxErrors))" :message="msg">
            {{ msg }}
          </slot>
        </div>
        <div v-else-if="props.hint || props.persistentHint">
          {{ props.hint }}
        </div>
      </slot>
    </div>
  </div>
</template>

