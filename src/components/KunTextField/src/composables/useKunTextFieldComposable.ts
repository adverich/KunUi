import { ref, computed, watch, inject, onUnmounted, type Ref, type ComputedRef } from 'vue'
import { debounce } from '../../../../utils/utils.js'

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

    const handleBlur = async (): Promise<void> => {
        inputFocused.value = false

        if (props.validateOnBlur) {
            const result = await runValidations()
            validationError.value = result === true ? '' : (result as string)
        }
        emits('blur');
    }

    const focusInput = (): void => {
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

    if (registerField) registerField({ validate })
    onUnmounted(() => {
        if (unregisterField) unregisterField({ validate })
    })

    return {
        inputField,
        inputValue,
        rootRef,
        inputFocused,
        validationError,
        hasError,
        handleInput,
        handleBlur,
        focusInput,
        validate,
        reset,
        resetValidation,
        clearInput
    }
}
