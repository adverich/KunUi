<template>
  <div class="w-full flex flex-col relative">
    <!-- Label -->
    <label
      v-if="label"
      :for="uid"
      :class="[
        'absolute left-2 transition-all duration-200 ease-in-out pointer-events-none select-none z-10',
        isActive || props.placeholder ? '-top-2 text-xs text-white/70 opacity-80' : 'top-3 text-sm text-white/70 opacity-80'
      ]"
    >
      {{ label }}
    </label>

    <div
      class="w-full flex flex-col justify-center relative border"
      :class="[
        inputFocused ? 'border-blue-600 shadow-[0_0_0_1px_rgba(59,130,246,0.5)]' : 'border-gray-900',
        disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-text',
        rounded
      ]"
      v-bind="$attrs"
    >
      <div
        class="flex flex-row items-center bg-gray-800 w-full h-full"
        :class="hasError ? 'bg-red-50' : ''"
      >
        <div v-if="prefix" class="mr-2">{{ prefix }}</div>
        <template v-if="$slots['prepend-inner']">
          <div :class="prependInnerClass" class="flex items-center justify-center min-w-[32px] h-full px-1">
            <slot name="prepend-inner" />
          </div>
        </template>

        <!-- Input -->
        <input
          ref="inputField"
          type="text"
          :value="inputValue"
          :id="uid"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :maxlength="maxlength"
          autocomplete="off"
          class="w-full h-full bg-transparent focus:outline-none p-2"
          :aria-invalid="hasError ? 'true' : 'false'"
          :aria-describedby="hasError ? `error-${uid}` : null"
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

        <template v-if="$slots['append-inner']">
          <div :class="appendInnerClass" class="flex items-center justify-center min-w-[32px] h-full px-1">
            <slot name="append-inner" />
          </div>
        </template>
        <div v-if="suffix" class="ml-2">{{ suffix }}</div>
      </div>

      <!-- Error -->
      <div
        v-if="hasError"
        :id="`error-${uid}`"
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
import { getCurrentInstance, computed } from 'vue';
import inputProps from '../composables/KunTextFieldProps';
import useKunTextField from '../composables/useKunTextFieldComposable';

const props = defineProps({ ...inputProps });
const emits = defineEmits([
  'update:modelValue',
  'focusInput',
  'blurInput',
  'handleClick',
  'keyDown',
  'keyUp'
]);

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
} = useKunTextField(props, emits);

defineExpose({
  validate,
  reset,
  resetValidation,
  inputField
});

const uid = `input-${getCurrentInstance().uid}`;
const isActive = computed(() => (inputFocused.value || !!inputValue.value) || props.dirty);
</script>
