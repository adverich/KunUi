<template>
  <div class="w-full flex flex-col relative">
    <!-- Label -->
    <label
      v-if="label"
      :for="`input-${_uid}`"
      class="mb-1 text-sm font-medium text-white"
    >
      {{ label }}
    </label>

    <!-- Input container -->
    <div
      class="w-full flex flex-col justify-center relative border"
      :class="[
        inputFocused ? 'border-blue-600 shadow-[0_0_0_1px_rgba(59,130,246,0.5)]' : hasError ? 'border-red-500' : 'border-gray-900',
        disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-text',
        rounded
      ]"
    >
      <div
        class="flex flex-row items-center p-2 bg-gray-800 w-full h-full"
        :class="hasError ? 'bg-red-50' : ''"
      >
        <div v-if="prefix" class="mr-2">{{ prefix }}</div>
        <slot name="prepend-inner" />

        <!-- Input -->
        <input
          ref="inputField"
          :type="type"
          :value="inputValue"
          :id="`input-${_uid}`"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :maxlength="maxlength"
          autocomplete="off"
          class="w-full h-full bg-transparent focus:outline-none text-center"
          :aria-invalid="hasError ? 'true' : 'false'"
          :aria-describedby="hasError ? `error-${_uid}` : null"
          @input="handleInput"
          @blur="handleBlur"
          @focus="focusInput"
          @click.stop="emits('handleClick')"
          @keydown="emits('keyDown', $event)"
          @keyup="emits('keyUp', $event)"
        />

        <!-- Clearable -->
        <button
          v-if="clearable && inputValue"
          type="button"
          @click="clearInput"
          class="ml-2 text-gray-400 hover:text-white"
          :disabled="disabled || readonly"
        >
          &times;
        </button>

        <slot />
        <slot name="append-inner" />
        <div v-if="suffix" class="ml-2">{{ suffix }}</div>
      </div>

      <!-- Error -->
      <div
        v-if="hasError"
        :id="`error-${_uid}`"
        class="text-red-500 text-sm mt-1 text-center"
      >
        {{ validationError || errorMessage }}
      </div>

      <!-- Hint -->
      <div
        v-else-if="hint && (persistentHint || inputFocused)"
        class="text-gray-400 text-xs mt-1 text-center"
      >
        {{ hint }}
      </div>

      <!-- Counter -->
      <div
        v-if="counter && maxlength"
        class="text-gray-400 text-xs mt-1 text-right"
      >
        {{ inputValue?.length || 0 }} / {{ maxlength }}
      </div>
    </div>
  </div>
</template>

<script setup>
import inputProps from '../composables/KunTextFieldProps'
import useKunTextField from '../composables/useKunTextFieldComposable'

const props = defineProps({ ...inputProps })
const emits = defineEmits([
  'update:modelValue',
  'focusInput',
  'blurInput',
  'handleClick',
  'keyDown',
  'keyUp'
])

const {
  inputField,
  inputValue,
  inputFocused,
  validationError,
  hasError,
  handleInput,
  handleBlur,
  focusInput,
  validate,
  reset,
  resetValidation,
  clearInput
} = useKunTextField(props, emits)

defineExpose({
  validate,
  reset,
  resetValidation,
  inputField
})
</script>
