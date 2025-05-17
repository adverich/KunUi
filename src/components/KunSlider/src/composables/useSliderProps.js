export const useSliderProps = () => {
    return {
        modelValue: {
            type: [Number, String],
            default: 0
        },
        min: {
            type: [Number, String],
            default: 0
        },
        max: {
            type: [Number, String],
            default: 100
        },
        step: {
            type: [Number, String],
            default: 1
        },
        label: {
            type: String,
            default: null
        },
        thumbLabel: {
            type: Boolean,
            default: true
        },
        ticks: {
            type: Boolean,
            default: false
        },
        tickSize: {
            type: [Number, String],
            default: 2
        },
        disabled: {
            type: Boolean,
            default: false
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
}