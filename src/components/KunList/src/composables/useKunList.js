import { ref, provide } from 'vue'

const listSymbol = Symbol('kun-list')

export function useKunList(props) {
    const selectedValues = ref([])

    function toggleItem(value) {
        if (!props.selectable || props.disabled) return

        const isMultiple = props.selectable === 'multiple'
        const isSingle = props.selectable === 'single'

        if (isSingle) {
            selectedValues.value = selectedValues.value[0] === value ? [] : [value]
        } else if (isMultiple) {
            const index = selectedValues.value.indexOf(value)
            index === -1
                ? selectedValues.value.push(value)
                : selectedValues.value.splice(index, 1)
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