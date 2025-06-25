<script setup>
import { computed, ref } from 'vue'
import KunIcon from '@/components/KunIcon/src/components/KunIcon.vue'
import { useCheckboxModel } from '../composables/useCheckboxModel'
import { useValidation } from '../composables/useValidation'
import { vRipple } from '@/directives/ripple.js'

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
  density: {
    type: String,
    default: 'default'
  },
  color: String,
  iconColor: [String, Boolean],
  baseColor: String,
  trueIcon: { type: null, default: '$checkboxOn' },
  falseIcon: { type: null, default: '$checkboxOff' },
  indeterminateIcon: { type: null, default: '$checkboxIndeterminate' },
  prependIcon: { type: null, default: undefined },
  appendIcon: { type: null, default: undefined },
  name: String,
  id: String,
  glow: Boolean,
  hideDetails: [Boolean, String],
  centerAffix: { type: Boolean, default: true },
  valueComparator: Function,
  validationValue: null,
})

const uid = `kun-checkbox-${Math.random().toString(36).substr(2, 8)}`
const checkboxId = computed(() => props.id || uid)
const isFocused = ref(false)

const {
  isChecked,
  toggle,
  internalValue,
} = useCheckboxModel(props, emit)

const {
  errorMessages,
  isValid,
  validate,
  resetValidation,
  blurHandler
} = useValidation(props, internalValue)
</script>

<template>
  <div
    :class="[
      'kun-checkbox',
      `kun-density-${props.density}`,
      props.color && `text-${props.color}`,
      props.baseColor && `border-${props.baseColor}`,
      {
        'kun-checked': isChecked,
        'kun-indeterminate': props.indeterminate,
        'kun-disabled': props.disabled,
        'kun-error': props.error || !isValid,
        'kun-focused': isFocused,
      },
    ]"
  >
    <div class="kun-checkbox__prepend" @click="$emit('click:prepend')">
      <slot name="prepend" />
      <KunIcon v-if="props.prependIcon" :icon="props.prependIcon" />
    </div>

    <div
      class="kun-checkbox__input"
      v-ripple="props.ripple"
      @click="toggle"
      @focus="() => { isFocused = true; emit('update:focused', true) }"
      @blur="() => { isFocused = false; emit('update:focused', false); blurHandler?.() }"
    >
      <KunIcon
        :icon="props.indeterminate ? props.indeterminateIcon : isChecked ? props.trueIcon : props.falseIcon"
        :class="[
          props.iconColor ? `text-${props.iconColor}` : '',
          props.glow && isFocused ? 'opacity-100' : 'opacity-70'
        ]"
      />
      <slot name="input" />
    </div>

    <div class="kun-checkbox__label" v-if="props.label || $slots.label">
      <slot name="label" :label="props.label">{{ props.label }}</slot>
    </div>

    <div class="kun-checkbox__append" @click="$emit('click:append')">
      <slot name="append" />
      <KunIcon v-if="props.appendIcon" :icon="props.appendIcon" />
    </div>

    <div
      class="kun-checkbox__messages"
      v-if="!props.hideDetails && (errorMessages?.length || props.hint || props.persistentHint)"
    >
      <slot name="details">
        <div v-if="(props.error || !isValid) && errorMessages?.length">
          <slot name="message" v-for="msg in errorMessages" :message="msg">
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
  align-items: center;
  gap: 0.5rem;
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
.kun-disabled {
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