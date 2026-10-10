export const kunCardSubtitleProps = {
    /** Texto del subtítulo (alternativa al slot). */
    subtitle: {
        type: [String, Number],
        default: null
    },
    /** Reduce el padding. */
    dense: {
        type: Boolean,
        default: false
    },
    /** Color del texto. */
    color: {
        type: String,
        default: 'text-ui-muted'
    },
    /** Peso del texto. */
    fontWeight: {
        type: String,
        default: 'font-normal'
    }
}
