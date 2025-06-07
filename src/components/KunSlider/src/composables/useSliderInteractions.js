export const useSliderInteractions = ({ trackRef, thumbs, props, emit }) => {
    const getRelativePosition = (e) => {
        const rect = trackRef.value.getBoundingClientRect()
        const pos = props.vertical ? (e.clientY - rect.top) / rect.height : (e.clientX - rect.left) / rect.width
        return Math.min(1, Math.max(0, props.vertical ? 1 - pos : pos))
    }

    const positionToValue = (pos) => {
        const raw = props.min + pos * (props.max - props.min)
        const stepped = Math.round((raw - props.min) / props.step) * props.step + props.min
        return Math.min(props.max, Math.max(props.min, stepped))
    }

    const onPointerDown = (e, index) => {
        e.preventDefault()
        if (props.disabled) return

        if (props.range) {
            if (index === 0 && newVal > thumbs.value[1]) return
            if (index === 1 && newVal < thumbs.value[0]) return
        }

        const move = (event) => {
            const pos = getRelativePosition(event)
            const newVal = positionToValue(pos)

            const next = [...thumbs.value]
            next[index] = Math.min(props.max, Math.max(props.min, newVal))

            emit('update:modelValue', props.range ? next : next[0])
        }

        const up = () => {
            document.removeEventListener('pointermove', move)
            document.removeEventListener('pointerup', up)
        }

        document.addEventListener('pointermove', move)
        document.addEventListener('pointerup', up)
    }

    const onTrackClick = (e) => {
        if (props.disabled) return
        const pos = getRelativePosition(e)
        const value = positionToValue(pos)

        const next = [...thumbs.value]
        const target = props.range ? (Math.abs(value - next[0]) < Math.abs(value - next[1]) ? 0 : 1) : 0

        next[target] = Math.min(props.max, Math.max(props.min, value))

        emit('update:modelValue', props.range ? next : next[0])
    }

    const onTickClick = (i) => {
        if (props.disabled) return
        const value = props.min + i * props.step

        const next = [...thumbs.value]
        const target = props.range ? (Math.abs(value - next[0]) < Math.abs(value - next[1]) ? 0 : 1) : 0

        next[target] = value

        emit('update:modelValue', props.range ? next : next[0])
    }

    return { onPointerDown, onTrackClick, onTickClick }
}
