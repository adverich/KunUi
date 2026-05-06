import kunTableProps from '../../../KunTable/src/composables/KunTableProps';

export default () => ({
    ...kunTableProps(),
    result: { type: Object, default: () => ({}) },
    loading: { type: Boolean, default: false },
    queryMode: {
        type: String,
        default: 'laravel',
        validator: v => ['laravel'].includes(v),
    },
});
