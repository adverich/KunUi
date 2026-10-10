<template>
  <div class="w-full flex flex-col relative h-fit" ref="rootRef">
    <div class="w-full flex flex-col justify-center relative">
      <div
        class="flex items-center w-full h-full border"
        :class="[bgInput, rounded, containerDensity,
          focus ? 'border-ui-focus shadow-ui-focus' : borderColor,
          disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-text',
          error ? 'bg-ui-error-soft' : ''
        ]"
      >
        <!-- Label flotante (centrado en reposo, arriba en foco/valor) -->
        <label
          v-if="label"
          :for="uid"
          :class="[labelColorClass, labelLeftClass, labelClass,
            'absolute transition-all duration-200 ease-in-out pointer-events-none select-none z-10 px-1',
            isFloating
              ? [floatingLabelTop, floatingLabelSize, floatingLabelOpacity, 'translate-y-0']
              : ['top-1/2 -translate-y-1/2', labelSize, labelOpacity]
          ]"
        >
          {{ label }}
        </label>

        <!-- Control - (SPLIT start) -->
        <div v-if="!noArrows && controlVariant === 'split'" class="h-full">
          <button
            type="button"
            class="p-3 text-lg border-r border-ui text-ui disabled:opacity-50 cursor-pointer hover:opacity-80"
            @click="onDecrement"
            :disabled="disabled || readonly"
          >−</button>
        </div>

        <!-- Prefix -->
        <div v-if="prefix" class="mx-2">{{ prefix }}</div>

        <!-- Prepend -->
        <div v-if="prependIcon || prependIconSlot" class="flex items-center justify-center h-full pl-2">
          <template v-if="prependIcon">
            <KunIcon :icon="prependIcon" />
          </template>
          <template v-else>
            <slot name="prepend-icon" />
          </template>
        </div>

        <!-- Prepend-inner -->
        <div v-if="hasPrependInner" :class="prependInnerClass"
          class="flex items-center justify-center shrink-0 min-w-[32px] px-1">
          <slot name="prepend-inner">
            <KunIcon v-if="prependInnerIcon" :icon="prependInnerIcon" :disabled="disabled" />
          </slot>
        </div>

        <!-- Input: type siempre "text" (hardcodeado a propósito).
             El formateo custom (separadores, agrupamiento, máscara bank) genera
             texto inválido para un number nativo: el navegador lo sanearía a
             vacío y mostraría spinners. La prop `type` se declara solo para
             capturarla y que no caiga al input vía $attrs. -->
        <input
          v-bind="$attrs"
          :id="uid"
          :name="name"
          ref="numberInput"
          type="text"
          :value="inputValue"
          :placeholder="(placeholder as string)"
          :readonly="readonly"
          :disabled="disabled"
          :required="required"
          :maxlength="maxlength"
          :autocomplete="autocomplete"
          :min="nativeMin"
          :max="nativeMax"
          :step="step"
          class="w-full h-full bg-transparent rounded focus:outline-none"
          :aria-invalid="error ? 'true' : 'false'"
          :class="[inputDensity, inputTextSizeClass, inputWeightClass, textColor, placeholderColor, placeholderTextSizeClass, rounded, textCenter ? 'text-center' : '', inputStyle]"
          @blur="handleBlur"
          @focus="handleFocus"
          @input="handleInput"
          @click.stop="emits('handleClick')"
          @keydown="handleKeyDown"
          @keyup="emits('keyUp', $event)"
          :inputmode="(inputmode as any)"
          pattern="[0-9]+([\.,][0-9]+)?"
        />

        <!-- Clearable -->
        <div v-if="clearable && inputValue != null" class="px-2">
          <KunBtn
            @click="onClear"
            rounded="rounded-full"
            bgColor="bg-error"
            :disabled="disabled || readonly"
            class="h-6 w-6"
          >
            <KunIcon :icon="IconClose" size="text-xs" />
          </KunBtn>
        </div>

        <!-- Controls: DEFAULT -->
        <template v-if="!noArrows">
          <div v-if="controlVariant === 'default'" class="flex items-center h-full">
            <button
              type="button"
              class="flex items-center border-l border-ui p-3 justify-center text-ui disabled:opacity-50 cursor-pointer hover:opacity-80"
              @click="onIncrement"
              :disabled="disabled || readonly"
            >▲</button>

            <button
              type="button"
              class="flex items-center border-l border-ui p-3 justify-center text-ui disabled:opacity-50 cursor-pointer hover:opacity-80"
              @click="onDecrement"
              :disabled="disabled || readonly"
            >▼</button>
          </div>

          <!-- Controls: STACKED -->
          <div v-if="controlVariant === 'stacked'" class="flex flex-col items-center justify-center border-l border-ui">
            <div class="border-b border-ui pb-1 px-3 flex hover:opacity-80 cursor-pointer" @click="onIncrement">
              <button
                type="button"
                class="text-xs text-ui disabled:opacity-50 cursor-pointer"
                :disabled="disabled || readonly"
              >▲</button>
            </div>
            <div class="border-t border-ui pt-1 px-3 flex hover:opacity-80 cursor-pointer" @click="onDecrement">
              <button
                type="button"
                class="text-xs text-ui disabled:opacity-50 cursor-pointer"
                :disabled="disabled || readonly"
              >▼</button>
            </div>
          </div>
        </template>

        <!-- Append-inner -->
        <div v-if="hasAppendInner" :class="appendInnerClass" class="flex items-center justify-center shrink-0 min-w-[32px] px-1">
          <slot name="append-inner">
            <KunIcon v-if="appendInnerIcon" :icon="appendInnerIcon" :disabled="disabled" />
          </slot>
        </div>

        <!-- Append icon -->
        <div v-if="appendIcon || appendIconSlot" class="flex items-center justify-center h-full pr-1">
          <template v-if="appendIcon">
            <KunIcon :icon="appendIcon" />
          </template>
          <template v-else>
            <slot name="append-icon" />
          </template>
        </div>

        <!-- Control + (SPLIT end) -->
        <div v-if="!noArrows && controlVariant === 'split'" class="h-full">
          <button
            type="button"
            class="p-3 text-lg border-l border-ui text-ui disabled:opacity-50 cursor-pointer hover:opacity-80"
            @click="onIncrement"
            :disabled="disabled || readonly"
          >+</button>
        </div>

        <!-- Suffix -->
        <div v-if="suffix" class="ml-2">{{ suffix }}</div>
      </div>

      <!-- Details -->
      <div v-if="!hideDetails" class="h-[1.25rem]">
        <div v-if="error || errorMessages" class="text-ui-error text-sm text-center">
          <div v-if="Array.isArray(errorMessages)">
            <div v-for="(msg, i) in errorMessages" :key="i">{{ msg }}</div>
          </div>
          <div v-else-if="typeof errorMessages === 'string'">{{ errorMessages }}</div>
        </div>
        <div v-else-if="hint && (persistentHint || focus)" class="text-xs text-center">
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

<script setup lang="ts">
import { useId, computed, nextTick, useSlots } from 'vue';
import { KunNumberFieldProps } from '../composables/KunNumberFieldProps.js';
import { useKunNumberField } from '../composables/useKunNumberFieldComposable.js';
import KunBtn from '../../../KunBtn/src/components/KunBtn.vue'
import KunIcon from '../../../KunIcon/src/components/KunIcon.vue'
import IconClose from '../../../../icons/IconClose.vue';

const props = defineProps(KunNumberFieldProps);
const emits = defineEmits([
  'update:modelValue',
  'focus',
  'input',
  'blur',
  'handleClick',
  'keyDown',
  'keyUp',
  'enter'
]);

const uid = props.id || `number-input-${useId()}`;
const slots = useSlots();
const prependIconSlot = !!slots['prepend-icon'];
const appendIconSlot = !!slots['append-icon'];
const hasPrependInner = computed(() => !!slots['prepend-inner'] || !!props.prependInnerIcon);
const hasAppendInner = computed(() => !!slots['append-inner'] || !!props.appendInnerIcon);
const hasPrefix = computed(() => !!props.prefix);

// Manejo de keydown con soporte especial para Enter (igual que KunTextField).
// validateKey mantiene el enmascarado en modo bank; Enter emite evento dedicado.
const handleKeyDown = (event: KeyboardEvent): void => {
  validateKey(event);
  emits('keyDown', event);

  if (event.key === 'Enter') {
    event.preventDefault();
    emits('enter', event);
  }
};

const {
  inputValue,
  numberInput,
  rootRef,
  onIncrement,
  onDecrement,
  onClear,
  validateKey,
  focus,
  handleFocus,
  handleBlur,
  handleInput
} = useKunNumberField(props, emits);

defineExpose({
  numberInput,
  rootRef,
  focus: () => {
    // Intentar focus inmediato si el elemento ya existe
    if (numberInput.value) {
      numberInput.value.focus();
    }
    
    // Usar nextTick siempre como respaldo para asegurar que el focus 
    // se aplique después de cualquier ciclo de renderizado pendiente
    nextTick(() => {
      if (numberInput.value) {
        numberInput.value.focus();
      }
    });
  }
});

const inputDensity = computed(() =>
  props.density === "compact" ? "p-1 min-h-[30px]" :
  props.density === "comfortable" ? "p-2 min-h-[38px]" :
  "p-3 min-h-[46px]"
);

// Tamaño del texto del valor. Default null = hereda (igual que KunTextField: 'text-sm').
const inputTextSizeClass = computed(() => props.inputTextSize || 'text-sm');

// Peso del texto del valor. Default null = hereda.
const inputWeightClass = computed(() => props.inputWeight || '');

// Tamaño del placeholder. Acepta 'text-lg' o 'placeholder:text-lg'.
// Default null = hereda el tamaño del input.
const placeholderTextSizeClass = computed(() => {
  if (!props.placeholderTextSize) return '';
  return props.placeholderTextSize.startsWith('placeholder:')
    ? props.placeholderTextSize
    : `placeholder:${props.placeholderTextSize}`;
});

// Estado flotante del label (igual que KunTextField).
const isActive = computed(() => (focus.value || String(inputValue.value ?? '') !== '' || props.dirty));
const isFloating = computed(() => isActive.value || !!props.placeholder);

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

// Misma escala que KunTextField: altura mínima del contenedor por densidad
const containerDensity = computed(() =>
  props.density === "compact" ? "min-h-[32px]" :
  props.density === "comfortable" ? "min-h-[40px]" :
  "min-h-[48px]"
);

const nativeMin = computed(() => Number.isFinite(Number(props.min)) ? props.min as string | number : undefined);
const nativeMax = computed(() => Number.isFinite(Number(props.max)) ? props.max as string | number : undefined);
</script>

