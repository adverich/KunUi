import { ref, watch } from 'vue'

export function useValidation(props, model) {
    const isValid = ref(true)
    const errorMessages = ref([])

    function runRules(value) {
        const rules = props.rules || []
        const messages = []

        for (const rule of rules) {
            if (typeof rule === 'function') {
                const result = rule(value)
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

    const validate = () => {
        const value = props.validationValue !== undefined ? props.validationValue : model.value
        const messages = runRules(value)
        errorMessages.value = messages
        isValid.value = messages.length === 0
        return isValid.value
    }

    const resetValidation = () => {
        errorMessages.value = []
        isValid.value = true
    }

    watch(model, () => {
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
