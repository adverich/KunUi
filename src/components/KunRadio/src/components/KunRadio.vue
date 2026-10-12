<script setup lang="ts">
import { computed, inject, useId, type Ref } from 'vue'
import KunIcon from '@/components/KunIcon/src/components/KunIcon.vue'
import { icons } from "@/icons"
import { kunRadioProps } from '../composables/kunRadioProps.js'

const props = defineProps(kunRadioProps)

const emits = defineEmits(['update:modelValue', 'focus', 'blur'])

interface KunRadioGroupContext {
  modelValue?: Ref<unknown>;
  update?: (value: unknown) => void;
  color?: Ref<string | undefined>;
  baseColor?: Ref<string | undefined>;
  name?: Ref<string | undefined>;
  disabled?: Ref<boolean | undefined>;
  readonly?: Ref<boolean | undefined>;
  error?: Ref<boolean | undefined>;
  trueIcon?: Ref<string | object | undefined>;
  falseIcon?: Ref<string | object | undefined>;
}

const radioGroup = inject<KunRadioGroupContext | null>('kun-radio-group', null)

const isDisabled = computed(() => props.disabled || radioGroup?.disabled?.value || false)
const isReadonly = computed(() => props.readonly || radioGroup?.readonly?.value || false)
const effectiveName = computed(() => props.name ?? radioGroup?.name?.value)
const effectiveColor = computed(() => props.color || radioGroup?.color?.value || 'text-primary')
const effectiveBaseColor = computed(() => props.baseColor || radioGroup?.baseColor?.value || 'text-ui-muted')

const onValue = computed(() => props.value ?? props.trueValue)
const isError = computed(() => props.error || radioGroup?.error?.value || false)

const isSelected = computed(() => {
  const val = radioGroup?.modelValue?.value ?? props.modelValue
  if (val === props.falseValue && val !== onValue.value) return false
  return val === onValue.value
})

const icon = computed(() =>
  isSelected.value ? (props.trueIcon ?? radioGroup?.trueIcon?.value ?? icons.radioboxMarked) : (props.falseIcon ?? radioGroup?.falseIcon?.value ?? icons.radioboxBlank)
)

const colorClass = computed(() =>
  isDisabled.value
    ? 'text-ui-disabled'
    : isError.value
    ? 'text-ui-error'
    : isSelected.value
    ? effectiveColor.value
    : effectiveBaseColor.value
)

const uid = useId()
const inputId = computed(() => props.id || `kun-radio-${uid}`)

function handleChange() {
  if (isReadonly.value || isDisabled.value) return
  const val = isSelected.value && props.value == null ? props.falseValue : onValue.value
  if (radioGroup) {
    radioGroup.update?.(val)
  } else {
    emits('update:modelValue', val)
  }
}
</script>

<template>
  <div
    class="inline-flex items-center gap-2 select-none cursor-pointer"
    :class="{ 'opacity-50 pointer-events-none': isDisabled || isReadonly }"
    @click="handleChange"
  >
    <!-- <input
      class="absolute w-0 h-0 opacity-0"
      type="radio"
      :id="inputId"
      :name="name"
      :disabled="disabled"
      :checked="isSelected"
      @change="handleChange"
      @focus="emits('focus')"
      @blur="emits('blur')"
    /> -->

    <input
      class="sr-only"
      type="radio"
      :id="inputId"
      :name="effectiveName"
      :disabled="isDisabled"
      :checked="isSelected"
      @change="handleChange"
    />

    <KunIcon
      :icon="icon"
      tabindex="0"
      role="radio"
      :aria-checked="isSelected"
      :class="[colorClass, 'text-xl transition-colors focus:ring-2 ring-primary rounded-full']"
      @keydown.enter.space.prevent="handleChange"
      @focus="emits('focus')"
      @blur="emits('blur')"
    />

    <slot name="label">
      <span v-if="label" class="text-sm">{{ label }}</span>
    </slot>
  </div>
</template>

