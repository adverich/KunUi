import type { Ref } from 'vue';

export type ClickOutsideHandler = (event: Event) => void;

export function useKunMenuComposable() {
    function onClickOutside(
        targetRef: Ref<HTMLElement | null>,
        handler: ClickOutsideHandler,
        ignoreRefs: Ref<HTMLElement | null>[] = [],
    ) {
        const handleClick = (event: Event): void => {
            const targetEl = targetRef.value
            if (!targetEl) return
            const composed = (event as Event & { composedPath?: () => EventTarget[] }).composedPath?.()[0];
            const clickedEl = composed || event.target
            const isIgnored = [targetEl, ...ignoreRefs.map((r: Ref<HTMLElement | null>) => r?.value)].some((el: HTMLElement | null | undefined) =>
                el?.contains(clickedEl as Node)
            )
            if (!isIgnored) handler(event)
        }

        const addEventListeners = (): void => {
            document.addEventListener('click', handleClick, true)
            document.addEventListener('touchstart', handleClick, true)
        }

        const removeEventListeners = (): void => {
            document.removeEventListener('click', handleClick, true)
            document.removeEventListener('touchstart', handleClick, true)
        }

        return { addEventListeners, removeEventListeners }
    }

    return { onClickOutside }
}
