<script setup>
import { computed, inject } from 'vue'
import KunIcon from '@/components/KunIcon/src/components/KunIcon.vue'
import { icons } from "@/icons"

const props = defineProps({
  modelValue: [String, Number, Boolean, Object],
  label: String,
  color: String,
  baseColor: String,
  trueValue: { default: true },
  falseValue: { default: false },
  trueIcon: { type: [String, Object], default: null },
  falseIcon: { type: [String, Object], default: null },
  value: [String, Number, Boolean, Object],
  disabled: Boolean,
  readonly: Boolean,
  error: Boolean,
  name: String,
  id: String,
})

const emit = defineEmits(['update:modelValue'])

const radioGroup = inject('kun-radio-group', null)

const isSelected = computed(() => {
  const val = radioGroup?.modelValue?.value ?? props.modelValue
  return val === (props.value ?? props.trueValue)
})

const icon = computed(() =>
  isSelected.value ? (props.trueIcon ?? icons.radioboxMarked) : (props.falseIcon ?? icons.radioboxBlank)
)

const colorClass = computed(() =>
  props.disabled
    ? 'text-gray-400'
    : isSelected.value
    ? props.color || 'text-primary'
    : props.baseColor || 'text-gray-500'
)

const uid = Math.random().toString(36).slice(2, 10)
const inputId = computed(() => props.id || `kun-radio-${uid}`)

function handleChange() {
  if (props.readonly || props.disabled) return
  const val = props.value ?? props.trueValue
  if (radioGroup) {
    radioGroup.update(val)
  } else {
    emit('update:modelValue', val)
  }
}
</script>

<template>
  <label
    :for="inputId"
    class="inline-flex items-center cursor-pointer gap-2 select-none"
    :class="{ 'opacity-50 pointer-events-none': disabled || readonly }"
  >
    <input
      class="sr-only"
      type="radio"
      :id="inputId"
      :name="name"
      :disabled="disabled"
      :checked="isSelected"
      @change="handleChange"
    />

    <KunIcon :icon="icon" :class="[colorClass, 'text-xl transition-colors']" />

    <slot name="label">
      <span v-if="label" class="text-sm">{{ label }}</span>
    </slot>
  </label>
</template>
