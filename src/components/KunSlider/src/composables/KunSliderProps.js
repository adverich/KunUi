export const KunSliderProps = {
    modelValue: {
        type: [Number, Array],
        default: 0
    },
    min: {
        type: Number,
        default: 0
    },
    max: {
        type: Number,
        default: 100
    },
    step: {
        type: Number,
        default: 1
    },
    ticks: {
        type: Boolean,
        default: false
    },
    tickLabels: {
        type: Boolean,
        default: false
    },
    tickSize: {
        type: Number,
        default: 2
    },
    tickColor: {
        type: String,
        default: 'border-red-400'
    },
    vertical: {
        type: Boolean,
        default: false
    },
    range: {
        type: Boolean,
        default: false
    },
    label: {
        type: String,
        default: null
    },
    thumbLabel: {
        type: Boolean,
        default: true
    },
    disabled: {
        type: Boolean,
        default: false
    },
    trackColor: {
        type: String,
        default: 'bg-blue-500'
    },
    thumbColor: {
        type: String,
        default: 'bg-blue-500'
    },
    class: {
        type: [String, Array, Object],
        default: null
    },
    style: {
        type: Object,
        default: null
    }
}
