import type { PropType } from 'vue';
import kunTableProps from '../../../KunTable/src/composables/KunTableProps.js';

export type KunTableServerSideQueryMode = 'laravel';

export default () => ({
    ...kunTableProps(),
    result: { type: Object as PropType<Record<string, unknown>>, default: () => ({}) },
    loading: { type: Boolean, default: false },
    queryMode: {
        type: String as PropType<KunTableServerSideQueryMode>,
        default: 'laravel',
        validator: (v: unknown) => ['laravel'].includes(v as string),
    },
});
