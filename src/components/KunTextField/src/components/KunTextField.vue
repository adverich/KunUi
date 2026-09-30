<template>
  <div class="w-full flex flex-col relative" ref="rootRef">
    <div class="w-full flex flex-col justify-center relative">
      <div class="flex flex-row items-center w-full border relative" :class="[bgInput, rounded, containerDensity,
        inputFocused ? 'border-ui-focus shadow-ui-focus' : borderColor,
        disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-text', 
        hasError ? 'bg-ui-error-soft' : ''
      ]">
        <!-- Label centrado contra el contenedor del input (no contra el wrapper con details) -->
        <label v-if="label" :for="uid" :class="[labelColorClass, labelLeftClass, labelClass,
          'absolute transition-all duration-200 ease-in-out pointer-events-none select-none z-10 px-1',
          isFloating
            ? [floatingLabelTop, floatingLabelSize, floatingLabelOpacity, 'translate-y-0']
            : ['top-1/2 -translate-y-1/2', labelSize, labelOpacity]
        ]">
          {{ label }}
        </label>

        <div v-if="prefix" class="ml-2 shrink-0">{{ prefix }}</div>

        <div v-if="hasPrependInner" :class="prependInnerClass"
          class="flex items-center justify-center shrink-0 min-w-[32px] px-1">
          <slot name="prepend-inner">
            <KunIcon v-if="prependInnerIcon" :icon="prependInnerIcon" :disabled="disabled" />
          </slot>
        </div>

        <slot name="prepend-input-content" />

        <!-- Input -->
        <input ref="inputField" v-bind="$attrs" :type="inputType" :value="inputValue" :id="uid" :name="name"
          :placeholder="placeholder" :autocomplete="autocomplete" :required="required" :disabled="disabled"
          :readonly="readonly" :inputmode="inputmode" :minlength="minlength" :maxlength="maxlength"
          :pattern="pattern" :spellcheck="spellcheck"
          class="min-w-12 flex-1 bg-transparent focus:outline-none leading-normal" :aria-invalid="hasError ? 'true' : 'false'"
          :class="[inputDensity, inputTextSizeClass, textColor, placeholderColor, placeholderTextSizeClass, rounded, textCenter ? 'text-center' : '', inputStyle]"
          :aria-describedby="hasError ? `error-${uid}` : null" 
          @input="handleInput" @blur="handleBlur" @focus="focusInput" 
          @click.stop="emits('handleClick')" 
          @keydown="handleKeyDown" @keyup="emits('keyUp', $event)" 
        />

        <!-- Clearable -->
         <KunIcon v-if="clearable && inputValue" @click="clearInput" size="small" color="error" :icon="icons.close"
          class="mr-1 shrink-0" :class="textColor" :disabled="disabled || readonly" />
      
        <slot />
      
        <div v-if="type === 'password' && showPasswordToggle" class="flex items-center justify-center shrink-0 min-w-[32px] px-1">
          <KunIcon :icon="passIcon" @click="fnShowPass" />
        </div>

        <div v-if="hasAppendInner" :class="appendInnerClass" class="flex items-center justify-center shrink-0 min-w-[32px] px-1">
          <slot name="append-inner">
            <KunIcon v-if="appendInnerIcon" :icon="appendInnerIcon" :disabled="disabled" />
          </slot>
        </div>
        <div v-if="suffix" class="mr-2 shrink-0">{{ suffix }}</div>
      </div>

      <div v-if="!hideDetails" class="h-[1.25rem]">
        <!-- Error -->
        <div v-if="hasError" :id="`error-${uid}`" class="text-ui-error text-sm text-center">
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
import { useId, useSlots, computed, ref, nextTick } from 'vue';
import { icons } from '@/icons'
import inputProps from '../composables/KunTextFieldProps';
import useKunTextField from '../composables/useKunTextFieldComposable';
import KunIcon from '../../../KunIcon/src/components/KunIcon.vue'

defineOptions({
  inheritAttrs: false
});

const props = defineProps({ ...inputProps });
const emits = defineEmits([
  'update:modelValue',
  'focus',
  'blur',
  'handleClick',
  'keyDown',
  'keyUp',
  'enter'
]);

const {
  inputField,
  inputValue,
  rootRef,
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

// Manejo de keydown con soporte especial para Enter
const handleKeyDown = (event) => {
  // Emitir evento keyDown para el padre
  emits('keyDown', event);
  
  // Manejar Enter de forma especial para evitar duplicados
  if (event.key === 'Enter') {
    // Prevenir comportamiento por defecto (ej: submit de formulario)
    event.preventDefault();
    // Emitir evento dedicado para Enter
    emits('enter', event);
  }
};

defineExpose({
  validate,
  reset,
  resetValidation,
  inputField,
  rootRef,
  focus: () => {
    // Intentar focus inmediato si el elemento ya existe
    if (inputField.value) {
      inputField.value.focus();
    }
    
    // Usar nextTick siempre como respaldo para asegurar que el focus 
    // se aplique después de cualquier ciclo de renderizado pendiente
    nextTick(() => {
      if (inputField.value) {
        inputField.value.focus();
      }
    });
  }
});

const uid = props.id || `input-${useId()}`;
const isActive = computed(() => ( inputFocused.value || inputValue.value !== '' || props.dirty ));
const isFloating = computed(() => isActive.value || !!props.placeholder);

const slots = useSlots();
const hasPrependInner = computed(() => !!slots['prepend-inner'] || !!props.prependInnerIcon);
const hasAppendInner = computed(() => !!slots['append-inner'] || !!props.appendInnerIcon);
const hasPrefix = computed(() => !!props.prefix);

// Desplaza el label cuando está dentro del campo para que no se solape con el icono interior o el prefijo.
// `labelLeft` / `floatingLabelLeft` permiten forzar la posición; `null` mantiene el cálculo automático.
const labelLeftClass = computed(() => {
  if (isFloating.value) return props.floatingLabelLeft || 'left-2';
  if (props.labelLeft) return props.labelLeft;
  if (hasPrependInner.value && hasPrefix.value) return 'left-[76px]';
  if (hasPrependInner.value) return 'left-10';
  if (hasPrefix.value) return 'left-10';
  return 'left-2';
});

const labelColorClass = computed(() =>
  isFloating.value ? (props.floatingLabelColor || props.labelColor) : props.labelColor
);
const labelSize = computed(() => props.labelSize);
const floatingLabelSize = computed(() => props.floatingLabelSize);
const labelOpacity = computed(() => props.labelOpacity);
const floatingLabelOpacity = computed(() => props.floatingLabelOpacity);
const floatingLabelTop = computed(() => props.floatingLabelTop);
const labelClass = computed(() => props.labelClass);

const showPass = ref(false);
const passIcon = computed(() => showPass.value ? icons.eyeOffOutline : icons.eyeOutline);
function fnShowPass() {
  showPass.value = !showPass.value;
}

const inputType = computed(() => {
  if (props.type === 'password') return showPass.value ? 'text' : 'password';
  return props.type;
});

const inputDensity = computed(() =>props.density === "compact" ? "px-2 py-1 min-h-[30px]" : props.density === "comfortable" ? "px-3 py-2 min-h-[38px]" : "px-3 py-3 min-h-[46px]");

// Tamaño del texto del valor (v-model). Default 'text-sm' para mantener el aspecto actual.
const inputTextSizeClass = computed(() => props.inputTextSize || 'text-sm');

// Tamaño del placeholder. Acepta 'text-lg' o 'placeholder:text-lg'.
// Default null = hereda el tamaño del input.
const placeholderTextSizeClass = computed(() => {
  if (!props.placeholderTextSize) return '';
  return props.placeholderTextSize.startsWith('placeholder:')
    ? props.placeholderTextSize
    : `placeholder:${props.placeholderTextSize}`;
});

const containerDensity = computed(() => props.density === "compact" ? "min-h-[32px]" : props.density === "comfortable" ? "min-h-[40px]" : "min-h-[48px]");
</script>
