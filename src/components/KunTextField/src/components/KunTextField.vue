<template>
  <div class="w-full flex flex-col relative" :class="testDetails ? 'mb-[1.25rem]' : ''">
    <!-- Label -->
    <label v-if="label" :for="uid" :class="[labelColor, 
      'absolute left-2 transition-all duration-200 ease-in-out pointer-events-none select-none z-10',
      isActive || props.placeholder ? '-top-2 text-xs opacity-80' : 'top-3 text-sm opacity-80'
    ]">
      {{ label }}
    </label>

    <div class="w-full flex flex-col justify-center relative" :class="rounded" v-bind="$attrs">
      <div class="flex flex-row items-center w-full h-full border" :class="[bgInput, 
        inputFocused ? 'border-blue-600 shadow-[0_0_0_1px_rgba(59,130,246,0.5)]' : 'border-gray-900',
        disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-text', hasError ? 'bg-red-200 : dark:bg-red-900' : ''
      ]">
        <div v-if="prefix" class="mr-2">{{ prefix }}</div>
        <div v-if="hasPrependInner" :class="prependInnerClass"
          class="flex items-center justify-center min-w-[32px] h-full px-1">
          <slot name="prepend-inner" />
        </div>

        <!-- Input -->
        <input ref="inputField" type="text" :value="inputValue" :id="uid" :placeholder="placeholder"
          :disabled="disabled" :readonly="readonly" :maxlength="maxlength" autocomplete="off"
          class="w-full h-full bg-transparent focus:outline-none p-3" :aria-invalid="hasError ? 'true' : 'false'"
          :class="[textColor, placeholderColor]"
          :aria-describedby="hasError ? `error-${uid}` : null" @input="handleInput" @blur="handleBlur"
          @focus="focusInput" @click.stop="emits('handleClick')" @keydown="emits('keyDown', $event)"
        @keyup="emits('keyUp', $event)" />

        <!-- Clearable -->
        <button v-if="clearable && inputValue" type="button" @click="clearInput"
          class="ml-2" :class="textColor" :disabled="disabled || readonly">
          &times;
        </button>

        <slot />

        <div v-if="hasAppendInner" :class="appendInnerClass"
          class="flex items-center justify-center min-w-[32px] h-full px-1">
          <slot name="append-inner" />
        </div>
        <div v-if="suffix" class="ml-2">{{ suffix }}</div>
      </div>

      <div v-if="!testDetails" class="h-[1.25rem]">
        <!-- Error -->
        <div v-if="hasError" :id="`error-${uid}`" class="text-red-500 text-sm  text-center">
          {{ validationError || errorMessage }}
        </div>
  
        <!-- Hint -->
        <div v-else-if="hint && (persistentHint || inputFocused)" class="text-xs text-center">
          {{ hint }}
        </div>
  
        <!-- Counter -->
        <div v-if="counter && maxlength" class="text-xs text-right">
          {{ inputValue?.length || 0 }} / {{ maxlength }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, useSlots, computed } from 'vue';
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

const slots = useSlots();
const hasPrependInner = computed(() => !!slots['prepend-inner']);
const hasAppendInner = computed(() => !!slots['append-inner']);

const testDetails = computed (() => !props.hideDetails && (hasError || 
  (hint && (persistentHint || inputFocused)) || 
  (counter && maxlength))
);
</script>
