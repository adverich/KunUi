// useKunNumberFieldComposable.js
import { ref, watch, computed, nextTick } from 'vue';
import * as nf from './numberFormatUtils';

/**
 * Composable para KunNumberField
 * - props.formatMode === 'bank'    -> modo bancario (estricto, rawNumberString, control fino del cursor)
 * - props.formatMode === 'natural' -> modo natural (entrada libre, normaliza '.'->',', respeta precision en input)
 */
export function useKunNumberField(props, emits) {
    const inputValue = ref('');
    const numberInput = ref(null);
    const rootRef = ref(null);
    const isActive = ref(false);
    const cursorPosition = ref(0);

    // Solo usado en modo bank
    let rawNumberString = '';

    const minLen = computed(() => {
        const precision = Number(props.precision);
        return precision > 0 ? precision + 1 : 1;
    });

    // =========================================================
    // MODO NATURAL (estilo Vuetify) - con control de precision en input
    // =========================================================
    function handleInputNatural(e) {
        const el = numberInput.value;
        if (!el) return;

        let val = el.value;
        const precision = Number(props.precision);
        const selStart = el.selectionStart || 0;

        if (precision === 0) {
            // Mantener solo dígitos
            let newVal = val.replace(/[^0-9]/g, '');

            // Evitar infinitos ceros iniciales
            newVal = newVal.replace(/^0+(\d)/, '$1');

            // Forzar DOM
            inputValue.value = newVal;
            nextTick(() => {
                if (!numberInput.value) return;
                numberInput.value.value = newVal;
                const cursorPos = Math.min(newVal.length, selStart);
                numberInput.value.setSelectionRange(cursorPos, cursorPos);
            });

            emits('input', newVal);
            return;
        }

        // 1) Normalizar puntos -> coma
        val = val.replace(/\./g, ',').replace(/\s+/g, '');
        // 2) Mantener solo dígitos y coma
        val = val.replace(/[^0-9,]/g, '');
        // 3) Mantener una sola coma
        if ((val.match(/,/g) || []).length > 1) {
            const parts = val.split(',');
            const integerPart = parts.shift() || '';
            const decimalPart = parts.join('');
            val = integerPart + (decimalPart.length ? ',' + decimalPart : '');
        }
        // 4) Limitar decimales
        if (val.includes(',')) {
            const [intP, decP = ''] = val.split(',');
            const truncatedDec = decP.slice(0, precision);
            val = intP + (truncatedDec.length ? ',' + truncatedDec : ',');
        }

        inputValue.value = val;
        nextTick(syncInputDom);

        nextTick(() => {
            const newCursor = selStart;
            el.setSelectionRange(newCursor, newCursor);
        });

        emits('input', val);
    }

    function syncInputDom() {
        if (!numberInput.value) return;
        numberInput.value.value = inputValue.value;
    }

    function handleFocusNatural(event) {
        isActive.value = true;
        if (!numberInput.value) return;

        const num = parseFloat(props.modelValue ?? 0);
        const precision = Number(props.precision);

        if (isNaN(num)) {
            inputValue.value = '';
            emits('focus');
            return;
        }

        if (precision === 0) {
            inputValue.value = String(Math.trunc(num));
        } else {
            const raw = nf.toRawNumberString(num, precision);
            const decPart = raw.slice(-precision);
            const allZero = /^0+$/.test(decPart);

            inputValue.value = allZero
                ? String(Math.trunc(num))
                : nf.format(num, { ...props, precision }).replace('.', ',');
        }

        nextTick(() => {
            try {
                const cameFromKeyboard =
                    event?.relatedTarget !== undefined ||
                    event?.sourceCapabilities?.firesTouchEvents === false;
                if (cameFromKeyboard) {
                    const len = inputValue.value.length;
                    numberInput.value.setSelectionRange(len, len);
                }
            } catch (e) { }
        });

        emits('focus');
    }

    function handleBlurNatural() {
        isActive.value = false;
        let val = (inputValue.value ?? '').toString().trim();
        if (!val) val = '0';

        val = val.replace(',', '.');
        let num = parseFloat(val);
        if (isNaN(num)) num = 0;

        num = nf.clamp(num, props.min, props.max);

        inputValue.value = nf.format(num, { ...props });
        emits('update:modelValue', num);
        emits('blur');
    }

    // =========================================================
    // MODO BANK
    // =========================================================
    function ensureMinLength(str) {
        if (Number(props.precision) === 0) {
            return str === '' ? '0' : str.replace(/^0+(\d)/, '$1');
        }
        return str.padStart(minLen.value, '0');
    }

    function visualToRawPosition(formatted, visualPos) {
        let rawPos = 0;
        for (let i = 0; i < visualPos; i++) {
            if (/\d/.test(formatted[i])) rawPos++;
        }
        return rawPos;
    }

    function rawToVisualPosition(formatted, rawPos) {
        let count = 0;
        for (let i = 0; i < formatted.length; i++) {
            if (/\d/.test(formatted[i])) {
                if (count === rawPos) return i;
                count++;
            }
        }
        for (let i = formatted.length - 1; i >= 0; i--) {
            if (/\d/.test(formatted[i])) return i + 1;
        }
        return formatted.length;
    }

    function normalizeCursorPosition(formatted, visualPos) {
        while (visualPos < formatted.length && !/\d/.test(formatted[visualPos])) visualPos++;
        if (visualPos >= formatted.length) {
            visualPos = formatted.length;
            while (visualPos > 0 && !/\d/.test(formatted[visualPos - 1])) visualPos--;
        }
        const firstDigit = formatted.search(/\d/);
        return visualPos < firstDigit ? firstDigit : visualPos;
    }

    function updateValue() {
        const minLenLocal = Number(props.precision) + 1;
        rawNumberString = String(rawNumberString || '').padStart(minLenLocal, '0');

        const integerDigits = Math.max(1, rawNumberString.length - Number(props.precision));
        const integerPart = rawNumberString.slice(0, integerDigits) || '0';
        const decimalPart = rawNumberString
            .slice(integerDigits)
            .padEnd(Number(props.precision), '0')
            .slice(0, Number(props.precision));

        const numStr = `${integerPart}.${decimalPart}`;
        const num = parseFloat(numStr);

        const clamped = nf.clamp(num, props.min, props.max);
        rawNumberString = nf.toRawNumberString(clamped, Number(props.precision));

        inputValue.value = nf.format(clamped, props);
        emits('update:modelValue', clamped);
        emits('input', clamped);

        nextTick(() => {
            if (!numberInput.value) return;
            try {
                const formatted = inputValue.value;
                let visualPos = rawToVisualPosition(formatted, cursorPosition.value);
                while (visualPos < formatted.length && !/\d/.test(formatted[visualPos])) visualPos++;
                numberInput.value.setSelectionRange(visualPos, visualPos);
            } catch (e) {
                numberInput.value.setSelectionRange(inputValue.value.length, inputValue.value.length);
            }
        });
    }

    function handleBlurBank() {
        isActive.value = false;
        rawNumberString = ensureMinLength(rawNumberString);
        const finalValue = nf.fromRawString(rawNumberString, Number(props.precision));
        const clamped = nf.clamp(finalValue, props.min, props.max);
        rawNumberString = nf.toRawNumberString(clamped, Number(props.precision));
        rawNumberString = ensureMinLength(rawNumberString);
        inputValue.value = nf.format(clamped, props);
        emits('update:modelValue', clamped);
        emits('blur');
    }

    function handleFocusBank(event) {
        isActive.value = true;
        nextTick(() => {
            if (!numberInput.value) return;
            const cameFromKeyboard =
                event?.relatedTarget !== undefined ||
                event?.sourceCapabilities?.firesTouchEvents === false;

            if (cameFromKeyboard) {
                const len = inputValue.value.length;
                numberInput.value.setSelectionRange(len, len);
                cursorPosition.value = inputValue.value.replace(/\D/g, '').length;
            } else {
                const visualPos = numberInput.value.selectionStart || 0;
                cursorPosition.value = visualToRawPosition(inputValue.value, visualPos);
            }
        });
        emits('focus');
    }

    function handleInputBank(e) {
        e.preventDefault?.();
    }

    function validateKey(event) {
        if (props.formatMode !== 'bank') return;
        const { key, target } = event;
        const isDigit = /^[0-9]$/.test(key);
        const isBackspace = key === 'Backspace';
        const isDelete = key === 'Delete';
        const isArrow = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key);
        const isCtrl = event.ctrlKey || event.metaKey;
        const isHome = key === 'Home';
        const isEnd = key === 'End';
        const isTab = key === 'Tab';

        if (isTab) return;
        if (isHome) {
            nextTick(() => {
                if (!numberInput.value) return;
                const formatted = inputValue.value;
                const firstDigitPos = formatted.search(/\d/);
                numberInput.value.setSelectionRange(firstDigitPos, firstDigitPos);
            });
            return;
        }
        if (isEnd) {
            nextTick(() => {
                if (!numberInput.value) return;
                const formatted = inputValue.value;
                numberInput.value.setSelectionRange(formatted.length, formatted.length);
            });
            return;
        }
        if (isArrow || isCtrl) return;

        const selStart = target?.selectionStart ?? 0;
        const visualPos = normalizeCursorPosition(inputValue.value, selStart);
        event.preventDefault();

        const minLenLocal = Number(props.precision) + 1;
        while (rawNumberString.length < minLenLocal) rawNumberString = '0' + rawNumberString;

        const rawPos = visualToRawPosition(inputValue.value, visualPos);

        if (isDigit) {
            rawNumberString = rawNumberString.substring(0, rawPos) + key + rawNumberString.substring(rawPos);
            cursorPosition.value = rawPos + 1;
        } else if (isBackspace && visualPos > 0) {
            const rp = visualToRawPosition(inputValue.value, visualPos);
            const nextCursor = rp - 1;

            if (rawNumberString.length <= Number(props.precision) + 1) {
                const nextCursorSafe = Math.max(0, rp - 1);
                rawNumberString = rawNumberString.slice(0, nextCursorSafe) + rawNumberString.slice(rp);
                rawNumberString = ensureMinLength(rawNumberString);
                cursorPosition.value = rp;
                updateValue();
                return;
            }

            if (rp > 0) {
                rawNumberString = rawNumberString.slice(0, nextCursor) + rawNumberString.slice(rp);
                rawNumberString = ensureMinLength(rawNumberString);
                cursorPosition.value = nextCursor;
            }
        } else if (isDelete && visualPos < inputValue.value.length) {
            if (rawPos < rawNumberString.length) {
                rawNumberString = rawNumberString.substring(0, rawPos) + rawNumberString.substring(rawPos + 1);
                cursorPosition.value = rawPos;
            }
        } else return;

        rawNumberString = ensureMinLength(rawNumberString);
        while (rawNumberString.length < minLenLocal) rawNumberString = '0' + rawNumberString;

        updateValue();
    }

    // =========================================================
    // INCREMENT/DECREMENT y CLEAR
    // =========================================================
    function onIncrement() {
        let current;
        if (props.formatMode === 'bank') {
            current = nf.fromRawString(rawNumberString, Number(props.precision)) || 0;
            current = nf.clamp(current + Number(props.step), props.min, props.max);
            rawNumberString = nf.toRawNumberString(current, Number(props.precision));
            inputValue.value = nf.format(current, props);
            emits('update:modelValue', current);
            emits('input', current);
        } else {
            current = parseFloat(props.modelValue ?? 0) || 0;
            current = nf.clamp(current + Number(props.step), props.min, props.max);
            inputValue.value = nf.format(current, props);
            emits('update:modelValue', current);
            emits('input', current);
        }
    }

    function onDecrement() {
        let current;
        if (props.formatMode === 'bank') {
            current = nf.fromRawString(rawNumberString, Number(props.precision)) || 0;
            current = nf.clamp(current - Number(props.step), props.min, props.max);
            rawNumberString = nf.toRawNumberString(current, Number(props.precision));
            inputValue.value = nf.format(current, props);
            emits('update:modelValue', current);
            emits('input', current);
        } else {
            current = parseFloat(props.modelValue ?? 0) || 0;
            current = nf.clamp(current - Number(props.step), props.min, props.max);
            inputValue.value = nf.format(current, props);
            emits('update:modelValue', current);
            emits('input', current);
        }
    }

    function onClear() {
        if (props.formatMode === 'bank') {
            rawNumberString = '0'.repeat(Number(props.precision) + 1);
            cursorPosition.value = Number(props.precision) + 1;
            updateValue();
            nextTick(() => numberInput.value?.focus?.());
        } else {
            inputValue.value = '';
            emits('update:modelValue', null);
            nextTick(() => numberInput.value?.focus?.());
        }
    }

    // ----------------------------
    // WATCH: sincroniza modelValue → inputValue
    // ----------------------------
    watch(
        [() => props.modelValue, () => props.precision, () => props.formatMode],
        ([newVal, newPrecision, mode]) => {
            if (mode !== 'bank') {
                inputValue.value = nf.format(newVal ?? 0, { ...props, precision: newPrecision });
                return;
            }

            if (newVal == null || isNaN(newVal)) {
                inputValue.value = nf.format(0, { ...props, precision: newPrecision });
                rawNumberString = '0'.repeat(Number(newPrecision) + 1);
            } else {
                const num = parseFloat(newVal);
                const clamped = nf.clamp(num, props.min, props.max);
                rawNumberString = nf.toRawNumberString(clamped, Number(newPrecision));
                if (rawNumberString.length < Number(newPrecision) + 1)
                    rawNumberString = rawNumberString.padStart(Number(newPrecision) + 1, '0');

                inputValue.value = nf.format(clamped, { ...props, precision: newPrecision });
            }
        },
        { immediate: true }
    );

    // ----------------------------
    // API expuesta
    // ----------------------------
    function handleInput(e) {
        if (props.formatMode !== 'bank') return handleInputNatural(e);
        return handleInputBank(e);
    }

    function handleFocus(e) {
        if (props.formatMode !== 'bank') return handleFocusNatural(e);
        return handleFocusBank(e);
    }

    function handleBlur(e) {
        if (props.formatMode !== 'bank') return handleBlurNatural(e);
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
        isActive,
        focus: isActive,
    };
}
