import { ref, watch, type Ref } from 'vue'

export type ValidationRule = ((value: unknown) => string | boolean) | string | false;
export type ValidatableModel = Ref<unknown> | { value: unknown };

interface ValidationProps {
    rules?: unknown[];
    validationValue?: unknown;
    maxErrors?: string | number;
    validateOn?: string;
}

export function useValidation(props: ValidationProps, model: ValidatableModel) {
    const isValid = ref(true)
    const errorMessages: Ref<string[]> = ref([])

    function runRules(value: unknown): string[] {
        const rules = (props.rules || []) as ValidationRule[]
        const messages: string[] = []

        for (const rule of rules) {
            if (typeof rule === 'function') {
                const result = (rule as (v: unknown) => string | boolean)(value)
                if (typeof result === 'string') messages.push(result)
                else if (result === false) messages.push('Campo inválido')
            } else if (typeof rule === 'string') {
                messages.push(rule)
            } else if (rule === false) {
                messages.push('Campo inválido')
            }
        }

        return messages
    }

    const validate = (): boolean => {
        const value =
            props.validationValue !== undefined
                ? props.validationValue
                : model.value

        const messages = runRules(value)
        errorMessages.value = messages.slice(0, Number(props.maxErrors ?? 1))
        isValid.value = messages.length === 0
        return isValid.value
    }

    const resetValidation = (): void => {
        errorMessages.value = []
        isValid.value = true
    }

    watch(model as Ref<unknown>, () => {
        if (props.validateOn === 'input' || props.validateOn?.includes('input')) {
            validate()
        }
    })

    return {
        errorMessages,
        isValid,
        validate,
        resetValidation
    }
}
