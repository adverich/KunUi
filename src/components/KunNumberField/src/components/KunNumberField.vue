<template>
  <div class="w-full flex flex-col relative" ref="rootRef">
    <label v-if="label" :for="uid" :class="[labelColor,
      'absolute left-2 transition-all duration-200 ease-in-out pointer-events-none select-none z-10',
      isActive ? '-top-2.25 text-xs opacity-80' : 'top-3 text-sm opacity-80']">
      {{ label }}
    </label>

    <div class="w-full flex flex-col justify-center relative" v-bind="$attrs">
      <div class="flex items-center w-full border"
           :class="[bgInput, rounded,
             inputFocused ? 'border-blue-600 shadow-[0_0_0_1px_rgba(59,130,246,0.5)]' : borderColor,
             disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-text',
             hasError ? 'bg-red-200 dark:bg-red-900' : '']">

        <div v-if="prefix" class="mx-2">{{ prefix }}</div>
        <slot name="prepend-inner" />

        <input ref="inputField"
          :id="uid"
          type="text"
          :value="rawInput"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :maxlength="maxlength"
          autocomplete="off"
          :aria-invalid="hasError ? 'true' : 'false'"
          :aria-describedby="hasError ? `error-${uid}` : null"
          :class="[inputDensity, textColor, placeholderColor, textCenter ? 'text-center' : '', 'w-full h-full bg-transparent focus:outline-none']"
          @input="handleInput"
          @blur="handleBlur"
          @focus="focusInput"
          @keydown="emits('keyDown', $event)"
          @keyup="emits('keyUp', $event)" 
        />

        <button v-if="clearable && rawInput" type="button" @click="clearInput" class="ml-2" :class="textColor">
          &times;
        </button>

        <div v-if="!noArrows" class="flex flex-col items-center justify-center border-l border-slate-600">
          <button type="button" class="p-2" @click="onIncrement" :disabled="disabled || readonly">▲</button>
          <button type="button" class="p-2" @click="onDecrement" :disabled="disabled || readonly">▼</button>
        </div>

        <slot name="append-inner" />
        <div v-if="suffix" class="ml-2">{{ suffix }}</div>
      </div>

      <div v-if="!hideDetails" class="h-[1.25rem]">
        <div v-if="hasError" :id="`error-${uid}`" class="text-red-500 text-sm text-center">
          {{ validationError || errorMessage }}
        </div>
        <div v-else-if="hint && (persistentHint || inputFocused)" class="text-xs text-center">
          {{ hint }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, computed, useSlots } from 'vue'
import useKunNumberField from '../composables/useKunNumberFieldComposable'
import { KunNumberFieldProps } from '../composables/KunNumberFieldProps'

const props = defineProps(KunNumberFieldProps)
const emits = defineEmits([
  'update:modelValue',
  'focus',
  'blur',
  'handleClick',
  'keyDown',
  'keyUp'
])

const {
  rawInput,
  inputValue,
  inputField,
  rootRef,
  inputFocused,
  handleInput,
  handleBlur,
  focusInput,
  clearInput,
  validationError,
  hasError,
  onIncrement,
  onDecrement,
  validate,
  reset,
  resetValidation
} = useKunNumberField(props, emits)

const uid = `number-input-${getCurrentInstance().uid}`
const isActive = computed(() => inputFocused.value || !!rawInput.value || props.dirty)

defineExpose({
  inputField,
  rootRef,
  validate,
  reset,
  resetValidation,
  focus: () => inputField.value?.focus()
})

const slots = useSlots()
const inputDensity = computed(() =>
  props.density === 'compact' ? 'p-1' :
  props.density === 'comfortable' ? 'p-2' : 'p-3'
)
</script>
