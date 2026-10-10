export const KunSliderProps = {
    /** Valor (v-model): número único o par [min, max] con `range`. */
    modelValue: {
        type: [Number, Array],
        default: 0
    },
    /** Valor mínimo. */
    min: {
        type: Number,
        default: 0
    },
    /** Valor máximo. */
    max: {
        type: Number,
        default: 100
    },
    /** Paso de incremento (teclado y ticks). */
    step: {
        type: Number,
        default: 1
    },
    /** Muestra marcas de ticks. */
    ticks: {
        type: Boolean,
        default: false
    },
    /** Muestra etiquetas en los ticks. */
    tickLabels: {
        type: Boolean,
        default: false
    },
    /** Tamaño de las marcas en px. */
    tickSize: {
        type: Number,
        default: 2
    },
    /** Color de las marcas. */
    tickColor: {
        type: String,
        default: 'border-error'
    },
    /** Orientación vertical. */
    vertical: {
        type: Boolean,
        default: false
    },
    /** Doble thumb (rango). El modelValue es `[min, max]`. */
    range: {
        type: Boolean,
        default: false
    },
    /** Etiqueta sobre el slider. */
    label: {
        type: String,
        default: null
    },
    /** Muestra el valor sobre el thumb. */
    thumbLabel: {
        type: Boolean,
        default: true
    },
    /** Deshabilita el slider. */
    disabled: {
        type: Boolean,
        default: false
    },
    /** Color del track. */
    trackColor: {
        type: String,
        default: 'bg-primary'
    },
    /** Color del thumb. */
    thumbColor: {
        type: String,
        default: 'bg-primary'
    },
    /** Clase extra del contenedor. */
    class: {
        type: [String, Array, Object],
        default: null
    },
    /** Estilos inline del contenedor. */
    style: {
        type: Object,
        default: null
    }
}
