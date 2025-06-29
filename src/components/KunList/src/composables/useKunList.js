import { ref, provide } from 'vue'

const listSymbol = Symbol('kun-list')

export function useKunList(props) {
    const selectedValues = ref([])

    function toggleItem(value) {
        if (!props.selectable || props.disabled || value == null) return

        const isMultiple = props.selectable === 'multiple'
        const isSingle = props.selectable === 'single'

        if (isSingle) {
            // Solo cambia si el valor es distinto
            if (selectedValues.value[0] !== value) {
                selectedValues.value = [value]
            }
        } else if (isMultiple) {
            const index = selectedValues.value.indexOf(value)
            if (index === -1) {
                selectedValues.value = [...selectedValues.value, value]
            } else {
                selectedValues.value = selectedValues.value.filter(v => v !== value)
            }
        }
    }


    function isSelected(value) {
        return selectedValues.value.includes(value)
    }

    // Proveemos el contexto a los hijos
    provide(listSymbol, {
        toggleItem,
        isSelected,
        isMultiple: () => props.selectable === 'multiple',
        isSingle: () => props.selectable === 'single',
    })

    return {
        selectedValues,
        toggleItem,
        isSelected
    }
}