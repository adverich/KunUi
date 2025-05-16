<template>
  <div class="w-full flex justify-center my-2" style="cursor: text;">
    <div
      :class="[
        'w-full h-full text-field-style flex flex-row items-center px-2',
        rounded ? 'rounded' : '',
        hasError ? 'border border-red-500 bg-red-50' : ''
      ]"
    >
      <!-- Prefix -->
      <div v-if="prefix" class="mr-2">{{ prefix }}</div>
      <slot name="prepend-inner" />

      <!-- Input principal -->
      <input
        ref="inputField"
        :type="type"
        :value="inputValue"
        autocomplete="off"
        class="h-full w-full bg-transparent focus:outline-none text-center"
        :placeholder="inputPlaceholder"
        @input="handleInput"
        @blur="handleBlur"
        @keydown.escape="handleEscape"
        @focus="handleFocus"
      />

      <!-- Suffix -->
      <slot name="append-inner" />
      <div v-if="suffix" class="ml-2">{{ suffix }}</div>
    </div>

    <!-- Mensaje de error -->
    <div v-if="hasError" class="text-red-500 text-sm mt-1 w-full text-left pl-1">
      {{ validationError }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch, onUnmounted } from 'vue';
import inputProps from '../composables/KunTextFieldProps';

const props = defineProps({ ...inputProps });
const emits = defineEmits(['update:modelValue', 'focusInput', 'blurInput', 'pressEsc', 'clickInput']);

const registerField = inject('registerField');
const unregisterField = inject('unregisterField');

const inputValue = ref(props.modelValue);
const isTouched = ref(false);

// Sync con modelValue externo
watch(
  () => props.modelValue,
  (newVal) => {
    inputValue.value = newVal;
  }
);

// Validación reutilizable
async function runValidations() {
  for (const rule of props.rules) {
    const result = await Promise.resolve(rule(inputValue.value));
    if (result !== true) return result;
  }
  return true;
}

// Error mostrado
const validationError = computed(() => {
  if (!isTouched.value || props.error) return props.errorMessage;
  return runValidations();
});

const hasError = computed(() =>
  props.error || (!!validationError.value && isTouched.value)
);

// Eventos
function handleInput(e) {
  inputValue.value = e.target.value;
  emits('update:modelValue', inputValue.value);
}

function handleBlur() {
  isTouched.value = true;
  emits('blurInput');
}

// Métodos públicos
async function validate() {
  isTouched.value = true;
  const error = await runValidations();
  return error === true;
}

function reset() {
  inputValue.value = props.modelValue;
  isTouched.value = false;
}

function resetValidation() {
  isTouched.value = false;
}

// Registro/desregistro
registerField({ validate });

onUnmounted(() => {
  unregisterField({ validate });
});

defineExpose({
  validate,
  reset,
  resetValidation
});
</script>