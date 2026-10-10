<template>
  <form
    ref="formEl"
    :class="`flex flex-col w-full ${props.gap} ${props.padding} ${props.maxWidth}`"
    novalidate
    @submit.prevent="handleSubmit"
    v-bind="$attrs"
  >
    <slot />
  </form>
</template>

<script setup lang="ts">
import { ref, provide, watch, computed, type Ref } from 'vue';
import { kunFormProps } from '../composables/kunFormProps.js'

const props = defineProps(kunFormProps)

const emit = defineEmits(['update:modelValue', 'submit']);

// Estado interno
export interface KunFormField {
  validate?: () => boolean | Promise<boolean>;
  reset?: () => void;
  resetValidation?: () => void;
}

const fields: Ref<KunFormField[]> = ref([]);
const isValid = ref(true);
const isDirty = ref(false);
const formEl: Ref<HTMLFormElement | null> = ref(null);

// Computed para exponer estado
const valid = computed(() => isValid.value);

// Registrar / eliminar campos
function registerField(field: KunFormField): void {
  if (!fields.value.includes(field)) {
    fields.value.push(field);
  }
}
function unregisterField(field: KunFormField): void {
  fields.value = fields.value.filter((f: KunFormField) => f !== field);
}

// Validación completa
async function validate() {
  const results = await Promise.all(
    fields.value.map(async (field: KunFormField) => {
      return typeof field.validate === 'function'
        ? await field.validate()
        : true;
    })
  );
  isValid.value = results.every((r: boolean) => r === true);
  emit('update:modelValue', isValid.value);
  return { valid: isValid.value };
}

// Reset
function reset() {
  fields.value.forEach(field => {
    if (typeof field.reset === 'function') field.reset();
  });
  resetValidation();
}

// Reset solo validación
function resetValidation() {
  fields.value.forEach(field => {
    if (typeof field.resetValidation === 'function') field.resetValidation();
  });
  isValid.value = true;
  emit('update:modelValue', true);
}

// Submit handler
async function handleSubmit(e: SubmitEvent): Promise<void> {
  if (props.validateOn === 'submit') {
    const { valid } = await validate();
    if (valid) {
      emit('submit', e);
    }
  } else {
    emit('submit', e);
  }
}

// Opcional: validar en "input"
function onFieldChange() {
  if (props.validateOn === 'input') {
    validate();
  }
}

// Proveer API a hijos
provide('kunForm', {
  registerField,
  unregisterField,
  onFieldChange,
  validateOn: props.validateOn
});

// Exponer métodos a padres
defineExpose({
  validate,
  reset,
  resetValidation,
  valid,
  isDirty
});

// Mantener v-model reactivo
watch(isValid, (v) => {
  emit('update:modelValue', v);
});
</script>

