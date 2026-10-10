import type { PropType } from 'vue';

export type KunCardActionsJustify =
  | 'justify-start' | 'justify-end' | 'justify-center' | 'justify-between' | 'justify-around';
export type KunCardActionsAlign = 'items-start' | 'items-end' | 'items-center' | 'items-stretch';

export const kunCardActionsProps = {
    /** Espaciado entre acciones. */
    gap: {
        type: [String, Number],
        default: 'gap-2'
    },
    /** Alineación horizontal de las acciones. */
    justify: {
        type: String as PropType<KunCardActionsJustify>,
        default: 'justify-start',
        validator: (v: unknown) => ['justify-start', 'justify-end', 'justify-center', 'justify-between', 'justify-around'].includes(v as string)
    },
    /** Alineación vertical de las acciones. */
    align: {
        type: String as PropType<KunCardActionsAlign>,
        default: 'items-center',
        validator: (v: unknown) => ['items-start', 'items-end', 'items-center', 'items-stretch'].includes(v as string)
    },
    /** Permite que las acciones pasen a múltiples líneas. */
    wrap: {
        type: Boolean,
        default: false
    },
    /** Reduce el padding. */
    dense: {
        type: Boolean,
        default: false
    }
}
