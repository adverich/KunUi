<script setup>
import inputProps from '../composables/KunTextFieldProps';
const props = defineProps(inputProps);
const emits = defineEmits(['update:modelValue', 'focusInput', 'blurInput', 'pressEsc', 'clickInput']);

const modelValue = defineModel('modelValue');
const placeholder = defineModel('placeholder');
const inputField = ref(null);

function updateModelValue(value){
    modelValue.value = value;
}

const focusInputFn = (event) => {
  const input = event.target.querySelector('input');
  if (input) {
    input.focus();
  }
};

const handleInput = (event) => {
  const input = event.target;
  updateModelValue(input.value);
};

watch(placeholder, (value) => {
    inputPlaceholder = value;
});

let inputPlaceholder = placeholder.value;

const handleFocus = () => {
    changeDivClass('rounded-b-none');
    inputPlaceholder = '';
    emits('focusInput');
}

const handleBlur = () => {
    inputPlaceholder = placeholder.value;
    changeDivClass('');
    // emits('blurInput');
}

const handleEscape = () => {
    inputField.value;
    if (inputField.value) {
        inputField.value.blur();
    }
    emits('pressEsc');
}

const handleClick = () => {
    emits('clickInput');
}

const classRounded = ref('');
function changeDivClass(data){
    classRounded.value = data;
}
</script>

<template>
    <div class="w-full h-full flex justify-center my-2" style="cursor: text;" @click="focusInputFn($event)">

        <slot name="prepend" />

        <div :class="classRounded, rounded" class="w-full h-full text-field-style flex flex-row items-center" style="padding: 0px 2px;">
            <div v-if="prefix">{{ prefix }}</div>
            <slot name="prepend-inner" />

            <slot name="default">
                <input ref="inputField" :type="type" :value="modelValue" autocomplete="off"
                class="h-full text-center w-full bg-transparent focus:border-none focus:outline-none input-opacity" 
                style="padding: 4px 0px;" :placeholder="inputPlaceholder" @input="handleInput($event)" 
                @keydown.escape="handleEscape" @focus="handleFocus" @blur="handleBlur" />
            </slot>

            <slot name="append-inner" />
            <div v-if="suffix">{{ suffix }}</div>
        </div>
        <slot name="append" />
    </div>
</template>
