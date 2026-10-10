import type { Ref } from 'vue';
import type { KunSliderPropsLike, KunSliderEmit } from './useSlider.js';

export interface SliderInteractionDeps {
    trackRef: Ref<HTMLElement | null>;
    thumbs: Ref<number[]>;
    props: KunSliderPropsLike;
    emit: KunSliderEmit;
}

export const useSliderInteractions = ({ trackRef, thumbs, props, emit }: SliderInteractionDeps) => {
    const getRelativePosition = (e: PointerEvent | MouseEvent): number => {
        const rect = trackRef.value?.getBoundingClientRect();
        if (!rect) return 0;
        const pos = props.vertical ? (e.clientY - rect.top) / rect.height : (e.clientX - rect.left) / rect.width;
        return Math.min(1, Math.max(0, props.vertical ? 1 - pos : pos));
    }

    const positionToValue = (pos: number): number => {
        const min = Number(props.min);
        const max = Number(props.max);
        const step = Number(props.step);
        const raw = min + pos * (max - min);
        const stepped = Math.round((raw - min) / step) * step + min;
        return Math.min(max, Math.max(min, stepped));
    }

    const onPointerDown = (e: PointerEvent, index: number): void => {
        e.preventDefault();
        if (props.disabled) return;

        const min = Number(props.min);
        const max = Number(props.max);

        const move = (event: PointerEvent): void => {
            const pos = getRelativePosition(event);
            const newVal = positionToValue(pos);

            // Evitar que los thumbs se crucen en modo rango
            if (props.range) {
                if (index === 0 && newVal > thumbs.value[1]) return;
                if (index === 1 && newVal < thumbs.value[0]) return;
            }

            const next = [...thumbs.value];
            next[index] = Math.min(max, Math.max(min, newVal));

            emit('update:modelValue', props.range ? next : next[0]);
        }

        const up = (): void => {
            document.removeEventListener('pointermove', move as EventListener);
            document.removeEventListener('pointerup', up);
        }

        document.addEventListener('pointermove', move as EventListener);
        document.addEventListener('pointerup', up);
    }

    const onTrackClick = (e: PointerEvent | MouseEvent): void => {
        if (props.disabled) return;
        const pos = getRelativePosition(e);
        const value = positionToValue(pos);

        const next = [...thumbs.value];
        const target = props.range ? (Math.abs(value - next[0]) < Math.abs(value - next[1]) ? 0 : 1) : 0;

        next[target] = Math.min(Number(props.max), Math.max(Number(props.min), value));

        emit('update:modelValue', props.range ? next : next[0]);
    }

    const onTickClick = (i: number): void => {
        if (props.disabled) return;
        const value = Number(props.min) + i * Number(props.step);

        const next = [...thumbs.value];
        const target = props.range ? (Math.abs(value - next[0]) < Math.abs(value - next[1]) ? 0 : 1) : 0;

        next[target] = value;

        emit('update:modelValue', props.range ? next : next[0]);
    }

    return { onPointerDown, onTrackClick, onTickClick };
}
