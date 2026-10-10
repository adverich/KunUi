import type { PropType } from 'vue';
import kunTableProps from '../../../KunTable/src/composables/KunTableProps.js';

export type KunTableServerSideQueryMode = 'laravel';

export default () => ({
    ...kunTableProps(),
    /** Respuesta paginada del servidor (`{ data, total, ... }`). Reutiliza todas las props de KunTable. */
    result: { type: Object as PropType<Record<string, unknown>>, default: () => ({}) },
    /** Estado de carga (muestra skeleton y bloquea ordenamiento). */
    loading: { type: Boolean, default: false },
    /** Formato de query emitido (`update:query`). */
    queryMode: {
        type: String as PropType<KunTableServerSideQueryMode>,
        default: 'laravel',
        validator: (v: unknown) => ['laravel'].includes(v as string),
    },
});
