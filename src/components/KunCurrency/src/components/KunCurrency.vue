<script setup>
import { ref, onMounted, computed } from 'vue';
import { useKunConfig, resolveConfigValue } from '../../../../config/kunConfig.js';

const globalConfig = useKunConfig();

const props = defineProps({
    currency:{
        type: Object,
        default: null,
    },
    hideCurrency:{
        type: Boolean,
        default: false
    },
    locale:{
        type: String,
        default: null
    },
    precision:{
        type: Number,
        default: null,
    },
    modelValue:{
        default: null,
    },
    placeholder:{
        type: String,
        default: '0.00'
    },
    prefix:{
        type: String,
        default: null
    },
    suffix:{
        type: String,
        default: ''
    },
})

// Valores resueltos con fallback a config global
const resolvedLocale = computed(() => 
    resolveConfigValue(props.locale, 'locale', 'es-AR')
);

const resolvedCurrency = computed(() => 
    props.currency ?? globalConfig.currency ?? { value: 'ARS', name: 'Pesos Argentinos', symbol: '$' }
);

const resolvedPrecision = computed(() => 
    resolveConfigValue(props.precision, 'precision', 2)
);

const resolvedPrefix = computed(() => 
    props.prefix ?? resolvedCurrency.value?.symbol ?? '$'
);

const emits = defineEmits(['update:modelValue'])

function updateModelValue(value){
    inputValue.value = value;
    emits('update:modelValue', value)
}

const inputValue = ref(props.modelValue);

let hide = null;
let txt = null;

onMounted(() =>{
    hide = document.getElementById('hide');
    txt = document.getElementById('txt');

    txt.addEventListener("input", resize);
    resize();
})

function resize() {
  hide.textContent = txt.value;
  txt.style.width = 6 + hide.offsetWidth + "px";
}

const focusInput = (event) => {
  const input = event.target.querySelector('input');
  if (input) {
    input.focus();
  }
};

const inputField = ref(null);

const handleNumericInput = (event) => {
  const input = event.target;
  const value = input.value;
  input.value = value.replace(/\D/g, '');
  updateModelValue(input.value);
};

let inputPlaceholder = props.placeholder;
let isInputFocused = false;

const handleFocus = () => {
    updateInputPlaceholder('');
}

const handleBlur = () => {
    updateInputPlaceholder(props.placeholder);
}

const updateInputPlaceholder = (value) => {
    document.getElementById('txt').setAttribute('placeholder', value);
}
</script>

<template>
    <div class="w-full h-full flex justify-center" style="cursor: text;" @click="focusInput($event)">
        <div class="flex flex-row items-center" style="padding: 2px 2px; max-width: 200px;">
            <div v-if="resolvedPrefix" class="mr-1">{{ resolvedPrefix }}</div>
            <span id="hide" />

            <input id="txt" ref="inputField" type="number" class="text-field-style" @focus="handleFocus" @blur="handleBlur" 
            :placeholder="inputPlaceholder" @input="handleNumericInput($event)" :value="inputValue" autocomplete="off" />

            <div v-if="suffix">{{ suffix }}</div>
        </div>
    </div>
</template>

<style scope>
#txt,
#hide {
  font: inherit;
  margin: 0;
  padding: 0;
}

#txt {
    padding: 0px 2px;
    text-align: center;
    min-width: 50px;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
}

#txt:focus-visible {
  outline: none;
}

#hide {
  position: absolute;
  height: 0;
  overflow: hidden;
  white-space: pre;
}
</style>