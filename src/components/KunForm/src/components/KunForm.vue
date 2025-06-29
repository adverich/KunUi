<template>
  <form @submit.prevent="handleSubmit" novalidate
    :class="`flex flex-col w-full ${props.gap} ${props.padding} ${props.maxWidth}`" v-bind="$attrs">
    <slot />
  </form>
</template>

<script setup>
import { ref, provide } from 'vue';

const props = defineProps({
  gap: {
    type: String,
    default: 'space-y-4'
  },
  padding: {
    type: String,
    default: 'px-2 py-4'
  },
  maxWidth: {
    type: String,
    default: 'max-w-full'
  }
});
const emits = defineEmits(["submit"]);

const fields = ref([]);

// Estado del formulario
const isValid = ref(true);

// Registrar campo
function registerField(field) {
  fields.value.push(field);
}

// Eliminar campo
function unregisterField(field) {
  fields.value = fields.value.filter(f => f !== field);
}

// Validar todo el formulario
async function validate() {
  const results = await Promise.all(
    fields.value.map(async (field) => {
      const valid = await field.validate();
      return valid;
    })
  );

  isValid.value = results.every(result => result === true);
  return { valid: isValid.value };
}

// Resetear valores de campos
function reset() {
  fields.value.forEach(field => {
    if (field.reset) field.reset();
  });
}

// Resetear validación (errores)
function resetValidation() {
  fields.value.forEach(field => {
    if (field.resetValidation) field.resetValidation();
  });
}

// Submit handler
function handleSubmit(event) {
  if (event && typeof event.preventDefault === 'function') {
    event.preventDefault();
  }
  validate().then(({ valid }) => {
    if (valid) {
      emits('submit');
    }
  });
}

// Exponer métodos a hijos anidados
provide('registerField', registerField);
provide('unregisterField', unregisterField);

// Exponer métodos públicos
defineExpose({
  validate,
  reset,
  resetValidation
});
</script>