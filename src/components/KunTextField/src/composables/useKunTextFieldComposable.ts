import { ref, computed, watch, inject, onMounted, onUnmounted, nextTick, type Ref, type ComputedRef } from 'vue'
import { debounce } from '../../../../utils/utils.js'
import { isAutofillAnimation, readNativeValue } from '../../../../utils/kunAutofill.js'

export type TextFieldRule = (value: unknown) => unknown;

export interface KunTextFieldPropsLike {
    modelValue?: unknown;
    error?: boolean;
    rules?: unknown[];
    debounce?: unknown;
    validateOnBlur?: boolean;
}

export type KunTextFieldEmit = (event: 'update:modelValue' | 'blur' | 'focus' | 'input', value?: unknown) => void;

export interface KunFormFieldApi {
    validate: () => Promise<boolean>;
    reset?: () => void;
    resetValidation?: () => void;
}

export default function useKunTextField(props: KunTextFieldPropsLike, emits: KunTextFieldEmit) {
    const inputValue: Ref<string> = ref((props.modelValue as string) ?? '')
    const inputFocused = ref(false)
    const validationError: Ref<string> = ref('')
    const isTouched = ref(false)
    const inputField: Ref<HTMLInputElement | null> = ref(null)
    const rootRef: Ref<HTMLElement | null> = ref(null)
    const syncing = ref(false)

    const registerField = inject<((field: KunFormFieldApi) => void) | null>('registerField', null)
    const unregisterField = inject<((field: KunFormFieldApi) => void) | null>('unregisterField', null)

    const hasError: ComputedRef<boolean> = computed(() => !!props.error || (!!validationError.value && isTouched.value))

    const runValidations = async (): Promise<unknown> => {
        for (const rule of props.rules || []) {
            const result = await Promise.resolve((rule as TextFieldRule)(inputValue.value))
            if (result !== true) return result
        }
        return true
    }

    const debouncedValidate = debounce(async () => {
        const result = await runValidations()
        validationError.value = result === true ? '' : (result as string)
    }, Number(props.debounce ?? 300))

    // Sincroniza valor externo con inputValue interno
    watch(() => props.modelValue, (newVal: unknown) => {
        if (newVal !== inputValue.value) {
            syncing.value = true;
            inputValue.value = (newVal as string) ?? ''
        }
    })

    // Reacciona a cambios en inputValue
    watch(inputValue, () => {
        if (syncing.value) {
            syncing.value = false
            return
        }

        isTouched.value = true
        emits('update:modelValue', inputValue.value)
        if (!props.validateOnBlur) debouncedValidate()
    })

    const handleInput = (e: Event): void => {
        inputValue.value = (e.target as HTMLInputElement).value
        emits('input', inputValue.value)
    }

    // Sincroniza el valor nativo del input al estado. El navegador puede
    // cambiarlo sin eventos de Vue (autofill, password managers, scripts):
    // sin esto el label flotante no sube sobre el texto visible.
    // Retorna true si hubo cambios.
    const syncFromDom = (): boolean => {
        const native = readNativeValue(inputField.value);
        if (native === null || native === inputValue.value) return false;
        inputValue.value = native;
        emits('input', native);
        return true;
    }

    // Chrome dispara `change` (pero no `input`) al autocompletar.
    const handleChange = (): void => {
        syncFromDom();
    }

    // `animationstart` de `kun-autofill-*` (ver `style.css`): autofill
    // aplicado por WebKit/Blink. Se lee en el próximo tick porque el valor
    // nativo se aplica junto con el estilo.
    const handleAnimationStart = (e: Event): void => {
        if (!isAutofillAnimation(e)) return;
        nextTick(() => {
            syncFromDom();
        });
    }

    const handleBlur = async (): Promise<void> => {
        // Por si el valor llegó sin eventos (autofill tardío): sincronizar
        // antes de apagar el foco para que el label quede arriba.
        syncFromDom();
        inputFocused.value = false

        if (props.validateOnBlur) {
            const result = await runValidations()
            validationError.value = result === true ? '' : (result as string)
        }
        emits('blur');
    }

    const focusInput = (): void => {
        // Si el navegador rellenó sin eventos, el padre recibe el valor ahora.
        syncFromDom();
        inputFocused.value = true;
        emits('focus')
    }

    const clearInput = (): void => {
        // Solo modificamos inputValue, el watcher se encarga de emitir update:modelValue
        inputValue.value = ''
        isTouched.value = true
        if (!props.validateOnBlur) debouncedValidate()
    }

    const validate = async (): Promise<boolean> => {
        isTouched.value = true
        const result = await runValidations()
        validationError.value = result === true ? '' : (result as string)
        return result === true
    }

    const reset = (): void => {
        inputValue.value = props.modelValue as string
        isTouched.value = false
        validationError.value = ''
    }

    const resetValidation = (): void => {
        isTouched.value = false
        validationError.value = ''
    }

    // Misma referencia para registrar/desregistrar (si no, el `filter(f !== field)`
    // de `KunForm` nunca encuentra el campo) e incluye `reset`/`resetValidation`
    // para que `KunForm.reset()` llegue a los text fields.
    const fieldApi: KunFormFieldApi = { validate, reset, resetValidation }
    if (registerField) registerField(fieldApi)
    onUnmounted(() => {
        if (unregisterField) unregisterField(fieldApi)
    })

    // Autofill aplicado antes del montaje o restaurado por bfcache: el valor
    // nativo ya está en el DOM pero el estado interno parte de `modelValue`.
    onMounted(() => {
        nextTick(() => {
            syncFromDom();
        });
    })

    return {
        inputField,
        inputValue,
        rootRef,
        inputFocused,
        validationError,
        hasError,
        handleInput,
        handleChange,
        handleAnimationStart,
        syncFromDom,
        handleBlur,
        focusInput,
        validate,
        reset,
        resetValidation,
        clearInput
    }
}
