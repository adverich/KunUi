import { computed, ref, watch, nextTick } from 'vue';
import {
    parseNumber,
    normalizeNumber,
} from './numberFormatUtils';

export function useKunNumberField(props, emit) {
    const inputValue = ref(props.modelValue);
    const numberInput = ref(null);
    const inputKey = ref(0);

    function updateValue(val) {
        if (!val) {
            inputValue.value = '0'; // Mostrar "0" en el input
            emit('update:modelValue', 0); // Asegurar que el modelo siempre maneja números
            return;
        }

        const normalizedInput = normalizeNumber(val, props.separator);
        const parts = normalizedInput.split(props.separator);

        // Bloquear múltiples separadores
        if (parts.length > 2) {
            updateInputKey();
            return;
        }

        // Limitar cantidad de decimales
        if (parts.length === 2 && parts[1].length > props.precision) {
            parts[1] = parts[1].slice(0, props.precision);
        }

        const formattedInput = parts.join(props.separator);

        // Si el valor no cambió, forzar actualización visual
        if (formattedInput === inputValue.value) {
            updateInputKey();
        } else {
            inputValue.value = formattedInput;
        }

        emit('update:modelValue', formattedInput || 0);
    }

    // Función auxiliar para actualizar `inputKey` y restaurar foco
    function updateInputKey() {
        inputKey.value++;
        nextTick(() => {
            numberInput.value?.focus();
        });
    }

    function onIncrement() {
        updateValue((inputValue.value || 0) + props.step);
    }

    function onDecrement() {
        updateValue((inputValue.value || 0) - props.step);
    }

    function onClear() {
        inputValue.value = null;
        emit('update:modelValue', null);
    }

    const focus = ref(false);
    function handleFocus() {
        focus.value = true;
        if (!inputValue.value) inputValue.value = '';
    }

    function handleBlur() {
        focus.value = false;
        if (!inputValue.value) inputValue.value = 0;
    }

    const isActive = computed(() => focus.value || !!props.modelValue || props.dirty);

    watch(() => props.modelValue, (val) => {
        inputValue.value = val;
    });

    return {
        inputValue,
        numberInput,
        inputKey,
        updateValue,
        onIncrement,
        onDecrement,
        onClear,
        focus,
        handleFocus,
        isActive,
        handleBlur
    };
}
