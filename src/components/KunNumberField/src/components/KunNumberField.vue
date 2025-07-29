<template>
  <div class="w-full flex flex-col relative h-fit" ref="rootRef">
    <!-- Label -->
    <label v-if="label" :for="uid" :class="[labelColor,
      'absolute left-2 transition-all duration-200 ease-in-out pointer-events-none select-none z-10',
      '-top-2.25 text-xs opacity-80'
    ]">
      {{ label }}
    </label>

    <div class="w-full flex flex-col justify-center relative" v-bind="$attrs">
      <div class="flex items-center w-full h-full border" :class="[bgInput, rounded,
        focus ? 'border-blue-600 shadow-[0_0_0_1px_rgba(59,130,246,0.5)]' : borderColor,
        disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-text',
        error ? 'bg-red-200 dark:bg-red-900' : ''
      ]">

        <!-- Control - (SPLIT start) -->
        <div v-if="!noArrows && controlVariant === 'split'" class="h-full">
          <button type="button"
            class="p-3 text-lg border-r border-slate-600 text-black dark:text-white disabled:opacity-50 cursor-pointer  hover:opacity-80"
            @click="onDecrement" :disabled="disabled || readonly">−</button>
        </div>

        <!-- Prefix -->
        <div v-if="prefix" class="mx-2">{{ prefix }}</div>

        <!-- Prepend -->
        <div v-if="prependIcon || prependIconSlot" class="flex items-center justify-center h-full pl-1">
          <template v-if="prependIcon">
            <KunIcon :icon="prependIcon" />
          </template>
          <template v-else>
            <slot name="prepend-icon" />
          </template>
        </div>

        <!-- Input -->
        <input :id="uid" ref="numberInput" type="text" :value="inputValue" :placeholder="placeholder"
          :readonly="readonly" :disabled="disabled" :maxlength="maxlength" autocomplete="off"
          class="w-full h-full bg-transparent rounded focus:outline-none" :aria-invalid="error ? 'true' : 'false'"
          :class="[inputDensity, textColor, placeholderColor, textCenter ? 'text-center' : '']"
          @blur="handleBlur" 
          @focus="handleFocus" 
          @keydown="validateKey($event), emits('keyDown', $event)" 
          @keyup="emits('keyUp', $event)" 
          inputmode="decimal"
          pattern="[0-9]+([\.,][0-9]+)?"
        />

        <!-- Clearable -->
        <button v-if="clearable && inputValue != null" type="button" @click="onClear" class="ml-2" :class="textColor"
          :disabled="disabled || readonly">
          &times;
        </button>

        <!-- Controls: DEFAULT -->
        <template v-if="!noArrows">
          <div v-if="controlVariant === 'default'" class="flex items-center h-full">
            <button type="button"
              class="flex items-center border-l border-slate-600 p-3 justify-center text-black dark:text-white hover:text-black/80 dark:hover:text-white/80 disabled:opacity-50 cursor-pointer hover:opacity-80"
              @click="onIncrement" :disabled="disabled || readonly">
              ▲
            </button>

            <button type="button"
              class="flex items-center border-l border-slate-600 p-3 justify-center text-black dark:text-white hover:text-black/80 dark:hover:text-white/80 disabled:opacity-50 cursor-pointer hover:opacity-80"
              @click="onDecrement" :disabled="disabled || readonly">
              ▼
            </button>
          </div>

          <!-- Controls: STACKED -->
          <div v-if="controlVariant === 'stacked'"
            class="flex flex-col items-center justify-center border-l border-slate-600">
            <div class="border-b border-slate-600 pb-1 px-3 flex hover:opacity-80 cursor-pointer" @click="onIncrement">
              <button type="button"
                class="text-xs text-black dark:text-white hover:text-black/80 dark:hover:text-white/80 disabled:opacity-50 cursor-pointer"
                :disabled="disabled || readonly">▲</button>
            </div>
            <div class="border-t border-slate-600 pt-1 px-3 flex hover:opacity-80 cursor-pointer" @click="onDecrement">
              <button type="button"
                class="text-xs text-black dark:text-white hover:text-black/80 dark:hover:text-white/80 disabled:opacity-50 cursor-pointer"
                :disabled="disabled || readonly">▼</button>
            </div>
          </div>
        </template>

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
          <button type="button"
            class="p-3 text-lg border-l border-slate-600 text-black dark:text-white disabled:opacity-50 cursor-pointer  hover:opacity-80"
            @click="onIncrement" :disabled="disabled || readonly">+</button>
        </div>

        <!-- Suffix -->
        <div v-if="suffix" class="ml-2">{{ suffix }}</div>
      </div>

      <!-- Details -->
      <div v-if="!hideDetails" class="h-[1.25rem]">
        <div v-if="error || errorMessages" class="text-red-500 text-sm text-center">
          <div v-if="Array.isArray(errorMessages)">
            <div v-for="(msg, i) in errorMessages" :key="i">{{ msg }}</div>
          </div>
          <div v-else-if="typeof errorMessages === 'string'">{{ errorMessages }}</div>
        </div>
        <div v-else-if="hint && (persistentHint || focus)" class="text-xs text-center">
          {{ hint }}
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { getCurrentInstance, computed, watch, useSlots } from 'vue';
import { KunNumberFieldProps } from '../composables/KunNumberFieldProps';
import { useKunNumberField } from '../composables/useKunNumberFieldComposable';
import KunIcon from '../../../KunIcon/src/components/KunIcon.vue'

const props = defineProps(KunNumberFieldProps);
const emits = defineEmits([
  'update:modelValue',
  'focus',
  'input',
  'blur',
  'handleClick',
  'keyDown',
  'keyUp'
]);

const uid = `number-input-${getCurrentInstance().uid}`;
const slots = useSlots();
const prependIconSlot = !!slots['prepend-icon'];
const appendIconSlot = !!slots['append-icon'];

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
  isActive,
  handleBlur
} = useKunNumberField(props, emits);

defineExpose({
  numberInput,
  rootRef,
  focus: () => numberInput.value?.focus()
});

const inputDensity = computed(() =>props.density === "compact" ? "p-1" : props.density === "comfortable" ? "p-2" : "p-3");
</script>
