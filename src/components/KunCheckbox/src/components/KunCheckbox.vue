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
  direction: { type: String, default: 'horizontal' } // 'vertical' o 'horizontal'
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

const densityClass = computed(() => ({
  default: 'kun-density-default',
  comfortable: 'kun-density-comfortable',
  compact: 'kun-density-compact'
}[props.density] || 'kun-density-default'))

const iconClass = computed(() => {
  const classes = []
  if (typeof props.iconColor === 'string') classes.push(`text-${props.iconColor}`)
  if (props.glow && isFocused.value) classes.push('opacity-100')
  else classes.push('opacity-70')
  return classes
})

const containerClass = computed(() => ({
  'kun-checkbox': true,
  'kun-disabled': props.disabled,
  'kun-readonly': props.readonly,
  'kun-error': props.error || !isValid.value,
  'kun-focused': isFocused.value,
  'kun-checked': isChecked.value,
  'kun-indeterminate': props.indeterminate,
  [`kun-direction-${props.direction}`]: true,
  [densityClass.value]: true,
  [`text-${props.color}`]: !!props.color,
  [`border-${props.baseColor}`]: !!props.baseColor,
  'items-center': props.centerAffix,
}))
</script>

<template>
  <div
    :class="containerClass"
    :style="{
      width: props.width ? props.width + 'px' : undefined,
      minWidth: props.minWidth ? props.minWidth + 'px' : undefined,
      maxWidth: props.maxWidth ? props.maxWidth + 'px' : undefined
    }"
  >
    <!-- Hidden input for form submit -->
    <input
      v-if="props.name"
      type="checkbox"
      :name="props.name"
      :checked="isChecked"
      :value="props.value ?? props.trueValue"
      class="hidden"
    />

    <!-- Prepend -->
    <div class="kun-checkbox__prepend" @click="$emit('click:prepend')">
      <slot name="prepend" />
      <KunIcon v-if="props.prependIcon" :icon="props.prependIcon" />
    </div>

    <!-- Checkbox input -->
    <div
      class="kun-checkbox__input"
      v-ripple="props.ripple && !props.readonly && !props.disabled"
      role="checkbox"
      :aria-checked="props.indeterminate ? 'mixed' : isChecked"
      :aria-disabled="props.disabled || props.readonly"
      :tabindex="props.disabled ? -1 : 0"
      @click="!props.readonly && toggle()"
      @focus="() => { isFocused = true; emit('update:focused', true) }"
      @blur="() => { isFocused = false; emit('update:focused', false); if (props.validateOn?.includes('blur')) validate() }"
      @keydown.space.prevent="!props.readonly && toggle()"
    >
      <KunIcon :icon="iconToRender" :class="iconClass" />
      <slot name="input" />
    </div>

    <!-- Label -->
    <div class="kun-checkbox__label" v-if="props.label || $slots.label">
      <slot name="label" :label="props.label">{{ props.label }}</slot>
    </div>

    <!-- Append -->
    <div class="kun-checkbox__append" @click="$emit('click:append')">
      <slot name="append" />
      <KunIcon v-if="props.appendIcon" :icon="props.appendIcon" />
    </div>

    <!-- Messages -->
    <div
      class="kun-checkbox__messages"
      v-if="!props.hideDetails && (errorMessages?.length || props.hint || props.persistentHint)"
    >
      <slot name="details">
        <div v-if="(props.error || !isValid) && errorMessages?.length">
          <slot name="message" v-for="msg in errorMessages.slice(0, Number(props.maxErrors))" :message="msg">
            {{ msg }}
          </slot>
        </div>
        <div v-else-if="props.hint || props.persistentHint">{{ props.hint }}</div>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.kun-checkbox {
  display: flex;
  gap: 0.5rem;
}
.kun-direction-vertical {
  flex-direction: column;
  align-items: flex-start;
}
.kun-checkbox__input {
  cursor: pointer;
  user-select: none;
  position: relative;
  border: 1px solid currentColor;
  border-radius: 0.25rem;
  padding: 0.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.kun-checkbox__label {
  cursor: pointer;
}
.kun-disabled,
.kun-readonly {
  opacity: 0.5;
  pointer-events: none;
}
.kun-error {
  color: var(--error-color, red);
}
.kun-density-default {
  height: 40px;
}
.kun-density-comfortable {
  height: 32px;
}
.kun-density-compact {
  height: 24px;
}
</style>
