import { ref, watch, computed, nextTick } from 'vue';
import * as nf from './numberFormatUtils';

/**
 * Composable para KunNumberField
 * - formatMode = "bank": manejo estricto con rawNumberString (modo financiero)
 * - formatMode = "natural": estilo Vuetify (entrada libre, normalización al blur)
 */
export function useKunNumberField(props, emits) {
    const inputValue = ref('');
    const numberInput = ref(null);
    const rootRef = ref(null);
    const focus = ref(false);
    const cursorPosition = ref(0);

    // Solo usado en modo bank
    let rawNumberString = '';

    const minLen = computed(() => {
        const precision = Number(props.precision);
        return precision > 0 ? precision + 1 : 1;
    });

    // =========================================================
    // NATURAL MODE (estilo Vuetify)
    // =========================================================
    function handleInputNatural(e) {
        let val = e.target.value ?? '';
        // Normalizar punto -> coma
        val = val.replace('.', ',');
        inputValue.value = val;
    }

    function handleFocusNatural() {
        focus.value = true;
        if (!numberInput.value) return;

        const num = parseFloat(props.modelValue ?? 0);
        if (Number.isInteger(num)) {
            inputValue.value = num.toString();
        } else {
            inputValue.value = num.toString().replace('.', ',');
        }
    }

    function handleBlurNatural() {
        focus.value = false;
        let val = inputValue.value?.toString().trim().replace(',', '.') ?? '0';
        let num = parseFloat(val);
        if (isNaN(num)) num = 0;

        num = nf.clamp(num, props.min, props.max);
        inputValue.value = nf.format(num, { ...props });
        emits('update:modelValue', num);
        emits('blur');
    }

    // =========================================================
    // BANK MODE (estricto con rawNumberString)
    // =========================================================
    function ensureMinLength(str) {
        if (Number(props.precision) === 0) {
            return str === '' ? '0' : str.replace(/^0+(\d)/, '$1');
        }
        return str.padStart(minLen.value, '0');
    }

    function toNumber(str) {
        const precision = Number(props.precision);
        if (str.length <= precision) str = str.padStart(precision + 1, '0');
        const intPart = str.slice(0, -precision) || '0';
        const decPart = str.slice(-precision);
        return parseFloat(`${intPart}.${decPart}`);
    }

    function updateValue() {
        const num = toNumber(rawNumberString);
        const clamped = nf.clamp(num, props.min, props.max);
        emits('update:modelValue', clamped);
        inputValue.value = nf.format(clamped, { ...props });
    }

    function handleInputBank(e) {
        e.preventDefault();
    }

    function handleFocusBank() {
        focus.value = true;
        nextTick(() => {
            numberInput.value?.setSelectionRange(0, inputValue.value.length);
        });
    }

    function handleBlurBank() {
        focus.value = false;
        updateValue();
        emits('blur');
    }

    function validateKey(e) {
        if (props.formatMode !== 'bank') return; // no aplica
        const precision = Number(props.precision);

        if (e.ctrlKey || e.metaKey || e.altKey) return;

        if (['Backspace', 'Delete'].includes(e.key)) {
            e.preventDefault();
            if (rawNumberString.length > minLen.value) {
                rawNumberString = rawNumberString.slice(0, -1);
            } else {
                rawNumberString = ensureMinLength(rawNumberString.slice(0, -1));
            }
            updateValue();
            return;
        }

        if (/\d/.test(e.key)) {
            e.preventDefault();
            rawNumberString += e.key;
            rawNumberString = ensureMinLength(rawNumberString);
            updateValue();
            return;
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            updateValue();
            emits('blur');
            return;
        }

        e.preventDefault(); // cualquier otra tecla no válida
    }

    // =========================================================
    // INCREMENT/DECREMENT y CLEAR
    // =========================================================
    function onIncrement() {
        if (props.disabled || props.readonly) return;
        let num = parseFloat(props.modelValue ?? 0);
        num += Number(props.step);
        num = nf.clamp(num, props.min, props.max);
        emits('update:modelValue', num);
        inputValue.value = nf.format(num, { ...props });
    }

    function onDecrement() {
        if (props.disabled || props.readonly) return;
        let num = parseFloat(props.modelValue ?? 0);
        num -= Number(props.step);
        num = nf.clamp(num, props.min, props.max);
        emits('update:modelValue', num);
        inputValue.value = nf.format(num, { ...props });
    }

    function onClear() {
        inputValue.value = '';
        rawNumberString = '';
        emits('update:modelValue', null);
    }

    // =========================================================
    // WATCHER sincroniza modelValue -> inputValue
    // =========================================================
    watch(
        [() => props.modelValue, () => props.precision, () => props.formatMode],
        ([newVal, newPrecision, mode]) => {
            if (mode === 'natural') {
                inputValue.value = nf.format(newVal ?? 0, { ...props, precision: newPrecision });
                return;
            }

            // --- modo bank ---
            if (newVal == null || isNaN(newVal)) {
                inputValue.value = nf.format(0, { ...props, precision: newPrecision });
                rawNumberString = '0'.repeat(Number(newPrecision) + 1);
            } else {
                const num = parseFloat(newVal);
                const clamped = nf.clamp(num, props.min, props.max);
                rawNumberString = nf.toRawNumberString(clamped, Number(newPrecision));
                if (rawNumberString.length < Number(newPrecision) + 1) {
                    rawNumberString = rawNumberString.padStart(Number(newPrecision) + 1, '0');
                }
                inputValue.value = nf.format(clamped, { ...props, precision: newPrecision });
            }
        },
        { immediate: true }
    );

    // =========================================================
    // API expuesta al componente
    // =========================================================
    function handleInput(e) {
        if (props.formatMode === 'natural') return handleInputNatural(e);
        return handleInputBank(e);
    }

    function handleFocus(e) {
        if (props.formatMode === 'natural') return handleFocusNatural(e);
        return handleFocusBank(e);
    }

    function handleBlur(e) {
        if (props.formatMode === 'natural') return handleBlurNatural(e);
        return handleBlurBank(e);
    }

    return {
        inputValue,
        numberInput,
        rootRef,
        validateKey,
        handleFocus,
        handleBlur,
        handleInput,
        onIncrement,
        onDecrement,
        onClear,
        focus
    };
}
