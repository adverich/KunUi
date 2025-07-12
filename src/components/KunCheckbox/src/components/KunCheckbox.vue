<script setup>
import { computed, ref, watch } from 'vue'
import KunIcon from '@/components/KunIcon/src/components/KunIcon.vue'
import { useCheckboxModel } from '../composables/useCheckboxModel'
import { useValidation } from '../composables/useValidation'
import { vRipple } from '@/directives/ripple.js'
import { icons } from '@/icons'

const emit = defineEmits([
  'update:modelValue',
  'update:focused',
  'click:append',
  'click:prepend'
])

const props = defineProps({
  modelValue: [Boolean, Array, String, Number, Object],
  trueValue: { type: null, default: true },
  falseValue: { type: null, default: false },
  value: null,
  indeterminate: Boolean,
  multiple: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  error: Boolean,
  label: String,
  hint: String,
  persistentHint: Boolean,
  errorMessages: [String, Array],
  rules: Array,
  validateOn: String,
  ripple: { type: [Boolean, Object], default: true },
  density: { type: String, default: 'default' },
  direction: { type: String, default: 'horizontal' },
  color: String,
  iconColor: [String, Boolean],
  baseColor: String,
  trueIcon: { type: null, default: undefined },
  falseIcon: { type: null, default: undefined },
  indeterminateIcon: { type: null, default: undefined },
  prependIcon: { type: null, default: undefined },
  appendIcon: { type: null, default: undefined },
  name: String,
  id: String,
  glow: Boolean,
  hideDetails: [Boolean, String],
  centerAffix: { type: Boolean, default: true },
  valueComparator: Function,
  validationValue: null,
  focused: Boolean,
  maxErrors: { type: [String, Number], default: 1 },
  width: [String, Number],
  minWidth: [String, Number],
  maxWidth: [String, Number],
  size: { type: String, default: 'md' } // 'sm', 'md', 'lg' o clases personalizadas
})

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
  if (props.indeterminate) return props.indeterminateIcon || icons.checkboxIndeterminate
  return isChecked.value
    ? (props.trueIcon || icons.checkboxOn)
    : (props.falseIcon || icons.checkboxBlank)
})

const iconClass = computed(() => [
  typeof props.iconColor === 'string' ? `text-${props.iconColor}` : '',
  props.glow && isFocused.value ? 'opacity-100' : 'opacity-70',
])

const iconSizeClass = computed(() => ({
  sm: 'w-4 h-4 text-sm',
  md: 'w-5 h-5 text-base',
  lg: 'w-6 h-6 text-lg'
}[props.size] || props.size)) // permite string personalizada tipo "w-6 h-6"
</script>

<template>
  <div
    :class="[
      'kun-checkbox',
      'flex',
      direction === 'vertical' ? 'flex-col items-start' : 'flex-row items-center',
      'gap-2',
      props.color && `text-${props.color}`,
      {
        'opacity-50 pointer-events-none': props.disabled || props.readonly,
        'text-red-600': props.error || !isValid,
        'focus-within:ring-2 ring-primary-500': isFocused,
      }
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

    <div class="flex items-center gap-2" @click="$emit('click:prepend')">
      <slot name="prepend" />
      <KunIcon v-if="props.prependIcon" :icon="props.prependIcon" />
    </div>

    <div
      class="relative inline-flex items-center justify-center cursor-pointer"
      :class="[iconSizeClass]"
      v-ripple="props.ripple"
      role="checkbox"
      :aria-checked="props.indeterminate ? 'mixed' : isChecked"
      :aria-disabled="props.disabled"
      :tabindex="props.disabled ? -1 : 0"
      @click="toggle"
      @focus="() => { isFocused = true; emit('update:focused', true) }"
      @blur="() => { isFocused = false; emit('update:focused', false); if (props.validateOn?.includes('blur')) validate() }"
      @keydown.space.prevent="toggle"
    >
      <KunIcon :icon="iconToRender" :class="[...iconClass, iconSizeClass]" />
      <slot name="input" />
    </div>

    <div class="cursor-pointer" v-if="props.label || $slots.label">
      <slot name="label" :label="props.label">{{ props.label }}</slot>
    </div>

    <div class="flex items-center gap-2" @click="$emit('click:append')">
      <slot name="append" />
      <KunIcon v-if="props.appendIcon" :icon="props.appendIcon" />
    </div>

    <div
      v-if="!props.hideDetails && (errorMessages?.length || props.hint || props.persistentHint)"
      class="text-xs text-gray-500 mt-1"
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
