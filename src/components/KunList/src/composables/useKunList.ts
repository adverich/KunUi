import { ref, provide, type Ref, type InjectionKey } from 'vue'

export interface KunListContext {
    toggleItem: (value: unknown) => void;
    isSelected: (value: unknown) => boolean;
    isMultiple: () => boolean;
    isSingle: () => boolean;
}

export const kunListSymbol: InjectionKey<KunListContext> = Symbol('kun-list');

interface KunListPropsLike {
    selectable?: boolean | string;
    disabled?: boolean;
}

export function useKunList(props: KunListPropsLike) {
    const selectedValues: Ref<unknown[]> = ref([])

    function toggleItem(value: unknown): void {
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

    function isSelected(value: unknown): boolean {
        return selectedValues.value.includes(value)
    }

    // Proveemos el contexto a los hijos
    provide(kunListSymbol, {
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
