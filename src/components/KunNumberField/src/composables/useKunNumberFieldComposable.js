// useKunNumberFieldComposable.js
import { ref, watch } from 'vue';
import * as nf from './numberFormatUtils';

export function useKunNumberField(props, emits) {
    const inputValue = ref('');
    const numberInput = ref(null);
    const rootRef = ref(null);
    const isActive = ref(false);

    let rawNumberString = '';

    watch(
        () => props.modelValue,
        (newVal) => {
            if (newVal == null || isNaN(newVal)) {
                inputValue.value = nf.format(0, props);
                rawNumberString = '';
            } else {
                const fixed = nf.toRawNumberString(newVal, props.precision);
                rawNumberString = fixed;
                inputValue.value = nf.format(parseFloat(newVal), props);
            }
        },
        { immediate: true }
    );

    function validateKey(event) {
        const key = event.key;
        const isDigit = /^[0-9]$/.test(key);
        const isBackspace = key === 'Backspace';

        if (!isDigit && !isBackspace) {
            event.preventDefault();
            return;
        }

        if (isDigit) {
            rawNumberString += key;
        } else if (isBackspace) {
            rawNumberString = rawNumberString.slice(0, -1);
        }

        const padded = rawNumberString.padStart(props.precision + 1, '0');
        const integerPart = padded.slice(0, -props.precision);
        const decimalPart = padded.slice(-props.precision);
        const newValue = parseFloat(`${integerPart}.${decimalPart}`);

        const clamped = nf.clamp(newValue, props.min, props.max);

        inputValue.value = nf.format(clamped, props);
        emits('update:modelValue', clamped);

        setTimeout(() => {
            emits('input', clamped);
        }, 100);
        event.preventDefault();
    }

    function handleBlur() {
        isActive.value = false;

        const finalValue = nf.fromRawString(rawNumberString, props.precision);
        const clamped = nf.clamp(finalValue, props.min, props.max);
        rawNumberString = nf.toRawNumberString(clamped, props.precision);
        inputValue.value = nf.format(clamped, props);
        emits('update:modelValue', clamped);
        emits('blur');
    }

    function handleFocus() {
        isActive.value = true;
        emits('focus');
    }

    function onIncrement() {
        let current = nf.fromRawString(rawNumberString, props.precision) || 0;
        current = nf.clamp(current + Number(props.step), props.min, props.max);
        rawNumberString = nf.toRawNumberString(current, props.precision);
        inputValue.value = nf.format(current, props);
        emits('update:modelValue', current);
    }

    function onDecrement() {
        let current = nf.fromRawString(rawNumberString, props.precision) || 0;
        current = nf.clamp(current - Number(props.step), props.min, props.max);
        rawNumberString = nf.toRawNumberString(current, props.precision);
        inputValue.value = nf.format(current, props);
        emits('update:modelValue', current);
    }

    function onClear() {
        rawNumberString = '';
        inputValue.value = nf.format(0, props);
        emits('update:modelValue', null);
    }

    return {
        inputValue,
        numberInput,
        rootRef,
        validateKey,
        handleFocus,
        handleBlur,
        onIncrement,
        onDecrement,
        onClear,
        isActive,
        focus: isActive
    };
}
