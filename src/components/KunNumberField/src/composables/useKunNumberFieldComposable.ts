// useKunNumberFieldComposable.ts
import { ref, watch, computed, nextTick, onMounted, type Ref } from 'vue';
import * as nf from './numberFormatUtils.js';
import { isAutofillAnimation, readNativeValue } from '../../../../utils/kunAutofill.js';

export interface KunNumberFieldPropsLike {
    modelValue?: unknown;
    precision?: unknown;
    min?: unknown;
    max?: unknown;
    step?: unknown;
    formatMode?: unknown;
    locale?: unknown;
    separator?: unknown;
    useGrouping?: unknown;
    debounce?: unknown;
    rules?: unknown;
    validateOnBlur?: unknown;
    hideZero?: unknown;
    placeholder?: unknown;
    label?: unknown;
    dirty?: unknown;
}

export type KunNumberFieldEmits = (event: 'update:modelValue' | 'input' | 'focus' | 'blur', value?: unknown) => void;

/**
 * Composable para KunNumberField
 * - props.formatMode === 'bank'    -> modo bancario (estricto, rawNumberString, control fino del cursor)
 * - props.formatMode === 'natural' -> modo natural (entrada libre, normaliza '.'->',', respeta precision en input)
 */
export function useKunNumberField(props: KunNumberFieldPropsLike, emits: KunNumberFieldEmits) {
    const inputValue: Ref<string> = ref('');
    const numberInput: Ref<HTMLInputElement | null> = ref(null);
    const rootRef: Ref<HTMLElement | null> = ref(null);
    const isActive = ref(false);
    const cursorPosition = ref(0);

    // Solo usado en modo bank
    let rawNumberString = '';

    // Mensaje de validación interna (reglas). '' = válido / sin reglas.
    const internalError: Ref<string> = ref('');

    // Separadores de formato: el decimal sale de `separator` (default ',');
    // los miles usan el otro ('.' si decimal es ',', ',' en caso contrario).
    // Con el default el comportamiento es idéntico al histórico.
    function separators(): { decimal: string; thousands: string } {
        const dec = String(props.separator ?? ',') || ',';
        return { decimal: dec, thousands: dec === ',' ? '.' : ',' };
    }

    function escapeRegExp(s: string): string {
        return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // hideZero con fallback automático: el cero se muestra vacío (placeholder/
    // label) solo cuando hay algo que ocupe el campo en reposo. Sin placeholder
    // y sin label en reposo (o con `dirty`, que flota el label al borde), la
    // caja quedaría fantasma y se muestra el 0 formateado. El v-model no cambia.
    function isEmptyModel(v: unknown): boolean {
        return v === null || v === undefined || (typeof v === 'string' && v.trim() === '');
    }

    function isZeroModel(v: unknown): boolean {
        if (isEmptyModel(v)) return false;
        const n = Number(v);
        return !isNaN(n) && n === 0;
    }

    function isBlankDisplay(v: unknown): boolean {
        return isEmptyModel(v) || isZeroModel(v);
    }

    function shouldHideZero(): boolean {
        if (!props.hideZero) return false;
        if (String(props.placeholder ?? '') !== '') return true;
        return String(props.label ?? '') !== '' && !props.dirty;
    }

    // Validación interna por reglas: la primera que falle fija el mensaje.
    // Corre al escribir (salvo `validateOnBlur`) y siempre al perder el foco.
    function runRules(value: unknown): boolean {
        const rules = Array.isArray(props.rules)
            ? props.rules as Array<(v: unknown) => boolean | string>
            : [];
        for (const rule of rules) {
            let res: boolean | string = true;
            try {
                res = rule(value);
            } catch {
                res = 'Valor inválido';
            }
            if (res !== true) {
                internalError.value = typeof res === 'string' ? res : 'Valor inválido';
                return false;
            }
        }
        internalError.value = '';
        return true;
    }

    const minLen = computed(() => {
        const precision = Number(props.precision);
        return precision > 0 ? precision + 1 : 1;
    });

    // -------------------
    // Helpers robustos
    // -------------------
    // Formatea un Number de forma determinista a estilo "español":
    // - miles con '.' y decimal con ','
    // - si trimZeros=true quita ceros finales en la parte decimal (para focus)
    function formatNumberForDisplay(num: unknown, precision: unknown = 2, trimZeros = false, withThousands = true): string {
        if (num == null || isNaN(Number(num))) return '';
        const p = Number(precision);
        const sign = Number(num) < 0 ? '-' : '';
        const absNum = Math.abs(Number(num));

        let raw = nf.toRawNumberString(absNum, p);
        const min = p + 1;
        if (raw.length < min) raw = raw.padStart(min, '0');

        const intRaw = raw.slice(0, raw.length - p) || '0';
        let decRaw = p > 0 ? raw.slice(-p) : '';

        if (p > 0 && trimZeros) {
            decRaw = decRaw.replace(/0+$/, '');
        }

        // 👇 Solo aplicar separador de miles si withThousands = true y useGrouping no lo desactiva
        const { decimal: decSep, thousands: thouSep } = separators();
        const grouping = withThousands && (props.useGrouping ?? true);
        const intFormatted = grouping
            ? intRaw.replace(/\B(?=(\d{3})+(?!\d))/g, thouSep)
            : intRaw;

        if (p === 0) return sign + intFormatted;
        if (!decRaw || decRaw.length === 0) return sign + intFormatted;

        return sign + intFormatted + decSep + decRaw;
    }

    // Parsea un string formateado (con miles y decimal usando '.' o ',')
    // Retorna Number o NaN si no es parseable.
    function parseFormattedToNumber(str: unknown): number {
        if (str == null) return NaN;
        let s = String(str).trim();
        if (!s) return NaN;

        // Quitar espacios
        s = s.replace(/\s+/g, '');

        // Separadores según props: miles se eliminan, decimal pasa a '.'.
        const { decimal: decSep, thousands: thouSep } = separators();
        s = s.split(thouSep).join('');
        if (decSep !== '.') s = s.split(decSep).join('.');

        // Mantener solo números, signo y decimal
        s = s.replace(/[^0-9\.\-]/g, '');

        return s === '' ? NaN : parseFloat(s);
    }

    const emitModelValue = useDebounce((num: unknown) => {
        emits('update:modelValue', num);
    }, Math.max(0, Number(props.debounce ?? 300)));

    // =========================================================
    // MODO NATURAL (estilo Vuetify) - con control de precision en input
    // =========================================================
    function handleInputNatural(e: Event): void {
        const el = numberInput.value;
        if (!el) return;

        let val = el.value;
        const precision = Number(props.precision);
        const selStart = el.selectionStart || 0;

        if (precision === 0) {
            // Mantener solo dígitos y signo
            let newVal = val.replace(/[^0-9\-]/g, '');

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

            // 🔹 NUEVO: actualizar modelValue en tiempo real
            const parsed = parseFormattedToNumber(newVal);
            if (!isNaN(parsed)) {
                emitModelValue(parsed);
            }

            return;
        }

        // 1) Normalizar el otro separador -> decimal (usuario podría escribir . como decimal)
        const { decimal: decSep } = separators();
        if (decSep !== '.') val = val.split('.').join(decSep);
        val = val.replace(/\s+/g, '');
        // 2) Mantener solo dígitos, decimal y signo
        val = val.replace(new RegExp(`[^0-9\\-${escapeRegExp(decSep)}]`, 'g'), '');
        // 3) Mantener un solo decimal
        const decCount = (val.split(decSep).length - 1);
        if (decCount > 1) {
            const parts = val.split(decSep);
            const integerPart = parts.shift() || '';
            const decimalPart = parts.join('');
            val = integerPart + (decimalPart.length ? decSep + decimalPart : '');
        }
        // 4) Limitar decimales
        if (val.includes(decSep)) {
            const [intP, decP = ''] = val.split(decSep);
            const truncatedDec = decP.slice(0, precision);
            val = intP + (truncatedDec.length ? decSep + truncatedDec : decSep);
        }

        inputValue.value = val;
        nextTick(syncInputDom);

        nextTick(() => {
            const newCursor = selStart;
            el.setSelectionRange(newCursor, newCursor);
        });

        emits('input', val);
        // Parsear provisionalmente a número para v-model con debounce
        const parsed = parseFormattedToNumber(val);
        if (!isNaN(parsed)) {
            emitModelValue(parsed);
        }
        if (!props.validateOnBlur) {
            runRules(!isNaN(parsed) ? parsed : val);
        }
    }

    function useDebounce<T extends (...args: never[]) => void>(fn: T, delay = 250): (...args: Parameters<T>) => void {
        let timeout: ReturnType<typeof setTimeout> | undefined;
        return (...args: Parameters<T>) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), delay);
        };
    }

    function syncInputDom() {
        if (!numberInput.value) return;
        numberInput.value.value = inputValue.value;
    }

    function handleFocusNatural(event: FocusEvent): void {
        isActive.value = true;
        if (!numberInput.value) return;

        const precision = Number(props.precision);

        // Fuente de verdad: lo que se está mostrando. Si hay texto visible se
        // edita sobre él (cubre uso sin v-model, donde props.modelValue nunca
        // se actualiza y Number(null) daría 0 → borrado fantasma).
        // Solo si está vacío se recurre al modelValue externo.
        const shown = (inputValue.value ?? '').toString().trim();
        const num = shown ? parseFormattedToNumber(shown) : Number(props.modelValue);

        if (isNaN(num)) {
            inputValue.value = '';
            emits('focus');
            return;
        }

        // Si es cero exacto → limpiar el input
        if (num === 0) {
            inputValue.value = '';
            const focusEl = numberInput.value;
            nextTick(() => {
                try {
                    focusEl?.setSelectionRange(0, 0);
                } catch { }
            });
            emits('focus');
            return;
        }

        // 🔹 Formatear sin separador de miles y sin ceros sobrantes
        let str = nf.toRawNumberString(Math.abs(num), precision);

        const intRaw = str.slice(0, str.length - precision) || '0';
        let decRaw = precision > 0 ? str.slice(-precision) : '';

        if (precision > 0) {
            // sacar ceros finales
            decRaw = decRaw.replace(/0+$/, '');
        }

        inputValue.value =
            (num < 0 ? '-' : '') +
            intRaw +
            (decRaw.length ? separators().decimal + decRaw : '');

        nextTick(() => {
            try {
                const len = inputValue.value.length;
                numberInput.value?.setSelectionRange(len, len);
            } catch { }
        });

        emits('focus');
    }

    function handleBlurNatural(_e?: unknown): void {
        isActive.value = false;
        let val = (inputValue.value ?? '').toString().trim();
        if (!val) val = '0';

        let num = parseFormattedToNumber(val);
        if (isNaN(num)) num = 0;

        num = nf.clamp(num, props.min, props.max);

        // Con hideZero el display queda vacío (placeholder/label) pero el modelo
        // sigue siendo 0 para no romper cálculos en tiempo real.
        if (shouldHideZero() && num === 0) {
            inputValue.value = '';
        } else {
            // Formatear determinísticamente con todos los decimales según precision
            inputValue.value = formatNumberForDisplay(num, Number(props.precision), false);
        }
        runRules(num);
        emits('update:modelValue', num);
        emits('blur');
    }

    // =========================================================
    // MODO BANK
    // =========================================================
    function ensureMinLength(str: string): string {
        if (Number(props.precision) === 0) {
            return str === '' ? '0' : str.replace(/^0+(\d)/, '$1');
        }
        return str.padStart(minLen.value, '0');
    }

    function visualToRawPosition(formatted: string, visualPos: number): number {
        let rawPos = 0;
        for (let i = 0; i < visualPos; i++) {
            if (/\d/.test(formatted[i])) rawPos++;
        }
        return rawPos;
    }

    function rawToVisualPosition(formatted: string, rawPos: number): number {
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

    function normalizeCursorPosition(formatted: string, visualPos: number): number {
        while (visualPos < formatted.length && !/\d/.test(formatted[visualPos])) visualPos++;
        if (visualPos >= formatted.length) {
            visualPos = formatted.length;
            while (visualPos > 0 && !/\d/.test(formatted[visualPos - 1])) visualPos--;
        }
        const firstDigit = formatted.search(/\d/);
        return visualPos < firstDigit ? firstDigit : visualPos;
    }

    function updateValue(): void {
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

        inputValue.value = formatNumberForDisplay(clamped, Number(props.precision), false);
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

    function handleBlurBank(_e?: unknown): void {
        isActive.value = false;
        rawNumberString = ensureMinLength(rawNumberString);
        const finalValue = nf.fromRawString(rawNumberString, Number(props.precision));
        const clamped = nf.clamp(finalValue, props.min, props.max);
        rawNumberString = nf.toRawNumberString(clamped, Number(props.precision));
        rawNumberString = ensureMinLength(rawNumberString);
        // Con hideZero el display queda vacío pero el modelo sigue siendo 0.
        inputValue.value = (shouldHideZero() && clamped === 0)
            ? ''
            : formatNumberForDisplay(clamped, Number(props.precision), false);
        runRules(clamped);
        emits('update:modelValue', clamped);
        emits('blur');
    }

    function handleFocusBank(event: FocusEvent): void {
        isActive.value = true;
        nextTick(() => {
            if (!numberInput.value) return;
            const focusEvent = event as FocusEvent & { sourceCapabilities?: { firesTouchEvents?: boolean } };
            const cameFromKeyboard =
                focusEvent?.relatedTarget !== undefined ||
                focusEvent?.sourceCapabilities?.firesTouchEvents === false;

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

    function handleInputBank(e: Event): void {
        (e as InputEvent).preventDefault?.();
    }

    // ----------------------------
    // validateKey (BANK)
    // ----------------------------
    function validateKey(event: KeyboardEvent): void {
        if (props.formatMode !== 'bank') return;
        const { key } = event;
        const target = event.target as HTMLInputElement | null;
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
        const formatted = inputValue.value || '';
        const rawPos = visualToRawPosition(formatted, selStart);

        event.preventDefault();

        const minLenLocal = Number(props.precision) + 1;
        while (rawNumberString.length < minLenLocal) rawNumberString = '0' + rawNumberString;

        if (isDigit) {
            rawNumberString = rawNumberString.substring(0, rawPos) + key + rawNumberString.substring(rawPos);
            cursorPosition.value = rawPos + 1;
        } else if (isBackspace) {
            if (rawPos > 0) {
                const removeIndex = rawPos - 1;
                rawNumberString = rawNumberString.substring(0, removeIndex) + rawNumberString.substring(removeIndex + 1);
                cursorPosition.value = removeIndex;
            }
        } else if (isDelete) {
            if (rawPos < rawNumberString.length) {
                rawNumberString = rawNumberString.substring(0, rawPos) + rawNumberString.substring(rawPos + 1);
                cursorPosition.value = rawPos;
            }
        } else return;

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
            inputValue.value = formatNumberForDisplay(current, Number(props.precision), false);
            emits('update:modelValue', current);
            emits('input', current);
        } else {
            current = Number(props.modelValue ?? 0) || 0;
            current = nf.clamp(current + Number(props.step), props.min, props.max);
            inputValue.value = formatNumberForDisplay(current, Number(props.precision), false);
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
            inputValue.value = formatNumberForDisplay(current, Number(props.precision), false);
            emits('update:modelValue', current);
            emits('input', current);
        } else {
            current = Number(props.modelValue ?? 0) || 0;
            current = nf.clamp(current - Number(props.step), props.min, props.max);
            inputValue.value = formatNumberForDisplay(current, Number(props.precision), false);
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
        [() => props.modelValue, () => props.precision, () => props.formatMode,
            () => props.hideZero, () => props.placeholder, () => props.label, () => props.dirty],
        ([newVal, newPrecision, mode]: unknown[]) => {
            if (mode !== 'bank') {
                if (isActive.value) {
                    const num = Number(newVal ?? 0);
                    if (num === 0) {
                        inputValue.value = '';
                    } else {
                        // 👇 sin miles, sin ceros extras
                        inputValue.value = formatNumberForDisplay(num, Number(newPrecision), true, false);
                    }
                } else {
                    // En reposo: con hideZero (y fallback permitido) el cero o el
                    // vacío se muestra sin texto para dejar ver placeholder/label.
                    // Sin nada que mostrar, cae al 0 formateado (fallback).
                    if (shouldHideZero() && isBlankDisplay(newVal)) {
                        inputValue.value = '';
                    } else {
                        // 👇 con miles y ceros completos
                        inputValue.value = formatNumberForDisplay(Number(newVal ?? 0), Number(newPrecision), false, true);
                    }
                }
                return;
            }

            if (newVal == null || isNaN(Number(newVal))) {
                rawNumberString = '0'.repeat(Number(newPrecision) + 1);
                inputValue.value = (shouldHideZero() && isEmptyModel(newVal))
                    ? ''
                    : formatNumberForDisplay(0, Number(newPrecision), false);
            } else {
                const num = Number(newVal);
                const clamped = nf.clamp(num, props.min, props.max);
                rawNumberString = nf.toRawNumberString(clamped, Number(newPrecision));
                if (rawNumberString.length < Number(newPrecision) + 1)
                    rawNumberString = rawNumberString.padStart(Number(newPrecision) + 1, '0');

                inputValue.value = (shouldHideZero() && clamped === 0)
                    ? ''
                    : formatNumberForDisplay(clamped, Number(newPrecision), false);
            }
        },
        { immediate: true }
    );

    // ----------------------------
    // Sincronización DOM -> estado (autofill del navegador)
    // ----------------------------
    // El navegador puede rellenar el input sin eventos de Vue (autofill,
    // password managers): sin esto el label flotante no sube sobre el texto
    // visible. Retorna true si hubo cambios.
    function syncFromDom(): boolean {
        const native = readNativeValue(numberInput.value);
        if (native === null || native === inputValue.value) return false;
        if (props.formatMode === 'bank') {
            const digits = native.replace(/\D/g, '');
            if (!digits) return false;
            rawNumberString = digits;
            const minLenLocal = Number(props.precision) + 1;
            while (rawNumberString.length < minLenLocal) rawNumberString = '0' + rawNumberString;
            updateValue();
            return true;
        }
        inputValue.value = native;
        emits('input', native);
        const parsed = parseFormattedToNumber(native);
        if (!isNaN(parsed)) emitModelValue(parsed);
        return true;
    }

    // Chrome dispara `change` (pero no `input`) al autocompletar.
    function handleChange(): void {
        syncFromDom();
    }

    // `animationstart` de `kun-autofill-*` (ver `style.css`).
    function handleAnimationStart(e: Event): void {
        if (!isAutofillAnimation(e)) return;
        nextTick(() => {
            syncFromDom();
        });
    }

    // Autofill aplicado antes del montaje o restaurado por bfcache.
    onMounted(() => {
        nextTick(() => {
            syncFromDom();
        });
    });

    // ----------------------------
    // API expuesta
    // ----------------------------
    function handleInput(e: Event): void {
        if (props.formatMode !== 'bank') return handleInputNatural(e);
        return handleInputBank(e);
    }

    function handleFocus(e: FocusEvent): void {
        syncFromDom();
        if (props.formatMode !== 'bank') return handleFocusNatural(e);
        return handleFocusBank(e);
    }

    function handleBlur(e: FocusEvent): void {
        // Sincronizar antes del commit del blur para no pisar un valor
        // autocompletado con el formateo del estado anterior.
        syncFromDom();
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
        handleChange,
        handleAnimationStart,
        syncFromDom,
        onIncrement,
        onDecrement,
        onClear,
        isActive,
        focus: isActive,
        internalError,
    };
}
