// useKunNumberFieldComposable.js
import { ref, watch, computed, nextTick } from 'vue';
import * as nf from './numberFormatUtils';

export function useKunNumberField(props, emits) {
    const inputValue = ref('');
    const numberInput = ref(null);
    const rootRef = ref(null);
    const isActive = ref(false);
    const cursorPosition = ref(0);

    let rawNumberString = '';

    const minLen = computed(() => Number(props.precision) > 0 ? Number(props.precision) + 1 : 1);

    function ensureMinLength(str) {
        if (Number(props.precision) === 0) {
            return str === '' ? '0' : str.replace(/^0+(\d)/, '$1');
        }
        return str.padStart(minLen.value, '0');
    }

    watch(() => props.modelValue, (newVal) => {
        if (newVal == null || isNaN(newVal)) {
            inputValue.value = nf.format(0, props);
            rawNumberString = '0'.repeat(Number(props.precision) + 1); // ✅ +1
        } else {
            const num = parseFloat(newVal);
            const clamped = nf.clamp(num, props.min, props.max);
            rawNumberString = nf.toRawNumberString(clamped, Number(props.precision));
            // Asegurar longitud mínima
            if (rawNumberString.length < Number(props.precision) + 1) {
                rawNumberString = rawNumberString.padStart(Number(props.precision) + 1, '0');
            }
            inputValue.value = nf.format(clamped, props);
        }
    }, { immediate: true });

    function validateKey(event) {
        const { key, target } = event;
        const isDigit = /^[0-9]$/.test(key);
        const isBackspace = key === 'Backspace';
        const isDelete = key === 'Delete';
        const isArrow = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key);
        const isCtrl = event.ctrlKey || event.metaKey;
        const isHome = key === 'Home';
        const isEnd = key === 'End';

        if (isHome) {
            // Mover cursor al principio del input (pos 0 o primer dígito)
            nextTick(() => {
                if (!numberInput.value) return;
                // Posición visual del primer dígito en input formateado
                const formatted = inputValue.value;
                const firstDigitPos = formatted.search(/\d/);
                numberInput.value.setSelectionRange(firstDigitPos, firstDigitPos);
            });
            return; // no prevenir default
        }

        if (isEnd) {
            // Mover cursor al final del input (última posición visual)
            nextTick(() => {
                if (!numberInput.value) return;
                const formatted = inputValue.value;
                numberInput.value.setSelectionRange(formatted.length, formatted.length);
            });
            return; // no prevenir default
        }

        if (isArrow || isCtrl) return;

        const visualPos = normalizeCursorPosition(inputValue.value, target.selectionStart);
        event.preventDefault();

        const minLen = Number(props.precision) + 1;

        // Asegurar que rawNumberString tenga longitud mínima
        while (rawNumberString.length < minLen) {
            rawNumberString = '0' + rawNumberString;
        }

        const rawPos = visualToRawPosition(inputValue.value, visualPos);

        if (isDigit) {
            rawNumberString = rawNumberString.substring(0, rawPos) + key + rawNumberString.substring(rawPos);
            cursorPosition.value = rawPos + 1;
        } else if (isBackspace && visualPos > 0) {
            const rawPos = visualToRawPosition(inputValue.value, visualPos);
            const nextCursor = rawPos - 1;

            if (rawNumberString.length <= (Number(props.precision) + 1)) {
                // Borrar el dígito en rawPos - 1 pero no mover el cursor
                const nextCursor = Math.max(0, rawPos - 1);
                rawNumberString = rawNumberString.slice(0, nextCursor) + rawNumberString.slice(rawPos);
                rawNumberString = ensureMinLength(rawNumberString);
                cursorPosition.value = rawPos; // ❗️Cursor NO se mueve
                updateValue();
                return;
            }

            if (rawPos > 0) {
                rawNumberString = rawNumberString.slice(0, nextCursor) + rawNumberString.slice(rawPos);
                rawNumberString = ensureMinLength(rawNumberString);
                cursorPosition.value = nextCursor;
            }
        } else if (isDelete && visualPos < inputValue.value.length) {
            if (rawPos < rawNumberString.length) {
                rawNumberString = rawNumberString.substring(0, rawPos) + rawNumberString.substring(rawPos + 1);
                cursorPosition.value = rawPos;
            }
        }

        // Asegurar longitud mínima ANTES de formatear
        rawNumberString = ensureMinLength(rawNumberString);

        // Asegurar longitud mínima antes de formatear
        while (rawNumberString.length < minLen) {
            rawNumberString = '0' + rawNumberString;
        }

        updateValue();
    }

    // Convierte posición en el input formateado → posición en rawNumberString
    function visualToRawPosition(formatted, visualPos) {
        let rawPos = 0;
        for (let i = 0; i < visualPos; i++) {
            if (/\d/.test(formatted[i])) {
                rawPos++;
            }
        }
        return rawPos;
    }

    // Convierte posición en rawNumberString → posición en el texto formateado
    function rawToVisualPosition(formatted, rawPos) {
        let count = 0;
        for (let i = 0; i < formatted.length; i++) {
            if (/\d/.test(formatted[i])) {
                if (count === rawPos) {
                    return i;
                }
                count++;
            }
        }
        // Si no se encontró una posición exacta, devolvemos la última posición numérica
        for (let i = formatted.length - 1; i >= 0; i--) {
            if (/\d/.test(formatted[i])) {
                return i + 1;
            }
        }
        return formatted.length;
    }

    function normalizeCursorPosition(formatted, visualPos) {
        // Si el cursor está sobre un separador, moverlo a la derecha (comportamiento natural)
        while (visualPos < formatted.length && !/\d/.test(formatted[visualPos])) {
            visualPos++;
        }

        // Si no hay dígitos a la derecha, ir hacia la izquierda
        if (visualPos >= formatted.length) {
            visualPos = formatted.length;
            while (visualPos > 0 && !/\d/.test(formatted[visualPos - 1])) {
                visualPos--;
            }
        }

        // 🔒 Previene colocarse justo antes del primer número (0)
        const firstDigit = formatted.search(/\d/);
        if (visualPos < firstDigit) {
            visualPos = firstDigit;
        }

        return visualPos;
    }

    function updateValue() {
        // Asegurar que rawNumberString tenga al menos precision + 1 dígitos
        const minLen = Number(props.precision) + 1;
        let padded = rawNumberString.padStart(minLen, '0');

        // Extraer partes
        const integerDigits = Math.max(1, rawNumberString.length - Number(props.precision));
        const integerPart = rawNumberString.slice(0, integerDigits) || '0';
        const decimalPart = rawNumberString.slice(integerDigits).padEnd(Number(props.precision), '0').slice(0, Number(props.precision));

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

                // Convertimos raw a visual utilizando el valor guardado
                let visualPos = rawToVisualPosition(formatted, cursorPosition.value);

                // Evitar quedar sobre separadores
                while (visualPos < formatted.length && !/\d/.test(formatted[visualPos])) {
                    visualPos++;
                }

                numberInput.value.setSelectionRange(visualPos, visualPos);
            } catch (e) {
                numberInput.value.setSelectionRange(inputValue.value.length, inputValue.value.length);
            }
        });
    }

    // Resto de funciones se mantienen EXACTAMENTE igual
    function handleBlur() {
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

    function handleFocus() {
        isActive.value = true;
        const visualPos = numberInput.value?.selectionStart || 0;
        cursorPosition.value = visualToRawPosition(inputValue.value, visualPos);
        emits('focus');
    }

    function onIncrement() {
        let current = nf.fromRawString(rawNumberString, Number(props.precision)) || 0;
        current = nf.clamp(current + Number(props.step), props.min, props.max);
        rawNumberString = nf.toRawNumberString(current, Number(props.precision));
        inputValue.value = nf.format(current, props);
        emits('update:modelValue', current);
    }

    function onDecrement() {
        let current = nf.fromRawString(rawNumberString, Number(props.precision)) || 0;
        current = nf.clamp(current - Number(props.step), props.min, props.max);
        rawNumberString = nf.toRawNumberString(current, Number(props.precision));
        inputValue.value = nf.format(current, props);
        emits('update:modelValue', current);
    }

    function onClear() {
        rawNumberString = '0'.repeat(Number(props.precision) + 1);
        cursorPosition.value = Number(props.precision) + 1;

        handleFocus();
        updateValue();
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