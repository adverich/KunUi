
<template>
  <div class="w-full flex flex-col justify-center relative rounded-t-md border"
  :class="inputFocused ? 'border-blue-600 shadow-[0_0_0_1px_rgba(59,130,246,0.5)]' : 'border-gray-900'" style="cursor: text;">
    <div
      :class="[
        'w-full h-full text-field-style flex flex-row items-center p-2 bg-gray-800',
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
        class="h-full w-full bg-transparent rounded focus:outline-none text-center"
        :placeholder="placeholder"
        @input="handleInput"
        @blur="handleBlur"
        @click.stop="emits('handleClick');"
        @focus="focusInput"
        @keydown="emits('keyDown', $event)"
        @keyup="emits('keyUp', $event)"
      />

      <slot />

      <!-- Suffix -->
      <slot name="append-inner" />
      <div v-if="suffix" class="ml-2">{{ suffix }}</div>
    </div>

    <!-- Mensaje de error -->
    <div v-if="hasError" class="text-red-500 text-sm mt-1 w-full text-center pl-1">
      {{ validationError }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch, onUnmounted } from 'vue';
import inputProps from '../composables/KunTextFieldProps';

const props = defineProps({ ...inputProps });
const emits = defineEmits(['update:modelValue', 'focusInput', 'blurInput', 'handleClick', 'keyDown', 'keyUp']);

const registerField = inject('registerField', null);
const unregisterField = inject('unregisterField', null);

const inputValue = ref(props.modelValue);
const isTouched = ref(false);
const validationError = ref('');
let syncing = false;

const inputFocused = ref(false);

// Sync con modelValue externo
// watch(() => props.modelValue, (newVal) => {
//   inputValue.value = newVal;
// });

// Validación reutilizable
async function runValidations() {
  for (const rule of props.rules) {
    const result = await Promise.resolve(rule(inputValue.value));
    if (result !== true) return result;
  }
  return true;
}

// Ejecutar validación cuando cambie el valor o cuando se toque
watch(() => props.modelValue, (newVal) => {
  if (newVal !== inputValue.value) {
    syncing = true
    inputValue.value = newVal
  }
})

watch(inputValue, () => {
  if (syncing) {
    syncing = false
    return
  }

  isTouched.value = true
  emits('update:modelValue', inputValue.value)

  clearTimeout(debounceTimeout.value)
  debounceTimeout.value = setTimeout(async () => {
    const result = await runValidations()
    validationError.value = result === true ? '' : result
  }, 300)
})

// Mostrar error si fue tocado o si el prop.error está activo
const hasError = computed(() =>
  props.error || (!!validationError.value && isTouched.value)
);

function focusInput() {
  inputFocused.value = true;
  emits('focusInput');
}

// Eventos
function handleInput(e) {
  inputValue.value = e.target.value;
  isTouched.value = true;
  emits('update:modelValue', inputValue.value);
}

async function handleBlur() {
  isTouched.value = true;
  inputFocused.value = false;
  const result = await runValidations();
  validationError.value = result === true ? '' : result;
  emits('blurInput');
}

// Métodos públicos
async function validate() {
  isTouched.value = true;
  const result = await runValidations();
  validationError.value = result === true ? '' : result;
  return result === true;
}

function reset() {
  inputValue.value = props.modelValue;
  isTouched.value = false;
  validationError.value = '';
}

function resetValidation() {
  isTouched.value = false;
  validationError.value = '';
}

// Registro/desregistro
if (registerField) {
  registerField({ validate });
}

onUnmounted(() => {
  if (unregisterField) {
    unregisterField({ validate });
  }
  clearTimeout(debounceTimeout.value);
});

const inputField = ref(null);
defineExpose({
  validate,
  reset,
  resetValidation,
  inputField
});

const debounceTimeout = ref(null);
// Validar con debounce cuando cambia el valor
// watch(inputValue, () => {
//   if (!isTouched.value) return;

//   clearTimeout(debounceTimeout.value);
//   debounceTimeout.value = setTimeout(async () => {
//     const result = await runValidations();
//     validationError.value = result === true ? '' : result;
//   }, 300);
// });
</script>