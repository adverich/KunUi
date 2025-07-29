<template>
  <div class="w-full flex flex-col relative" ref="rootRef">
    <label v-if="label" :for="uid" :class="[labelColor,
      'absolute left-2 transition-all duration-200 ease-in-out pointer-events-none select-none z-10',
      isActive ? '-top-2.25 text-xs opacity-80' : 'top-3 text-sm opacity-80'
    ]">
      {{ label }}
    </label>

    <div class="w-full flex flex-col justify-center relative" v-bind="$attrs">
      <div class="flex items-center w-full border"
           :class="[bgInput, rounded,
             inputFocused ? 'border-blue-600 shadow-[0_0_0_1px_rgba(59,130,246,0.5)]' : borderColor,
             disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-text',
             hasError ? 'bg-red-200 dark:bg-red-900' : '']">

        <!-- Prefix / Prepend -->
        <div v-if="prefix" class="mx-2">{{ prefix }}</div>
        <slot name="prepend-inner" />

        <!-- Input -->
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
               @keyup="emits('keyUp', $event)" />

        <!-- Clear -->
        <button v-if="clearable && rawInput" type="button" @click="clearInput" class="ml-2" :class="textColor" :disabled="disabled || readonly">
          &times;
        </button>

        <!-- Increment/Decrement -->
        <div v-if="!noArrows" class="flex flex-col items-center justify-center border-l border-slate-600">
          <button type="button" class="p-2" @click="onIncrement" :disabled="disabled || readonly">▲</button>
          <button type="button" class="p-2" @click="onDecrement" :disabled="disabled || readonly">▼</button>
        </div>

        <!-- Suffix / Append -->
        <slot name="append-inner" />
        <div v-if="suffix" class="ml-2">{{ suffix }}</div>
      </div>

      <!-- Details -->
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
import { getCurrentInstance, computed, ref, watch } from 'vue'
import { KunNumberFieldProps } from '../composables/KunNumberFieldProps.js'
import { normalizeNumber, parseNumber } from '../composables/numberFormatUtils.js'

const props = defineProps(KunNumberFieldProps)
const emits = defineEmits([
  'update:modelValue',
  'focus',
  'blur',
  'handleClick',
  'keyDown',
  'keyUp'
])

const uid = `number-input-${getCurrentInstance().uid}`
const inputField = ref(null)
const rootRef = ref(null)
const inputFocused = ref(false)
const validationError = ref('')
const isTouched = ref(false)
const syncing = ref(false)

const rawInput = ref(props.modelValue != null ? formatNumber(props.modelValue, props.separator, props.precision) : '')

const hasError = computed(() => props.error || (!!validationError.value && isTouched.value))
const isActive = computed(() => inputFocused.value || !!rawInput.value || props.dirty)

function formatNumber(num, separator = '.', precision = 2) {
  if (num == null || isNaN(num)) return ''
  return Number(num).toFixed(precision).replace('.', separator)
}

watch(() => props.modelValue, (newVal) => {
  if (syncing.value) {
    syncing.value = false
    return
  }
  const formatted = formatNumber(newVal, props.separator, props.precision)
  if (formatted !== rawInput.value) {
    rawInput.value = formatted
  }
})

function handleInput(e) {
  rawInput.value = e.target.value
  const parsed = parseNumber(rawInput.value, props.separator)
  syncing.value = true
  emits('update:modelValue', parsed)
}

function handleBlur() {
  inputFocused.value = false
  isTouched.value = true
  emits('blur')
}

function focusInput() {
  inputFocused.value = true
  emits('focus')
}

function clearInput() {
  rawInput.value = ''
  syncing.value = true
  emits('update:modelValue', null)
  isTouched.value = true
}

function onIncrement() {
  const current = parseNumber(rawInput.value, props.separator) || 0
  const next = current + Number(props.step)
  rawInput.value = formatNumber(next, props.separator, props.precision)
  syncing.value = true
  emits('update:modelValue', next)
}

function onDecrement() {
  const current = parseNumber(rawInput.value, props.separator) || 0
  const next = current - Number(props.step)
  rawInput.value = formatNumber(next, props.separator, props.precision)
  syncing.value = true
  emits('update:modelValue', next)
}

defineExpose({
  inputField,
  rootRef,
  focus: () => inputField.value?.focus()
})
</script>
