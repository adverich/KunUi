export function useKunMenuComposable() {
    function onClickOutside(targetRef, handler, ignoreRefs = []) {
        const handleClick = (event) => {
            const targetEl = targetRef.value
            if (!targetEl) return
            const clickedEl = event.composedPath?.()[0] || event.target
            const isIgnored = [targetEl, ...ignoreRefs.map(r => r?.value)].some(el =>
                el?.contains(clickedEl)
            )
            if (!isIgnored) handler(event)
        }

        const addEventListeners = () => {
            document.addEventListener('click', handleClick, true)
            document.addEventListener('touchstart', handleClick, true)
        }

        const removeEventListeners = () => {
            document.removeEventListener('click', handleClick, true)
            document.removeEventListener('touchstart', handleClick, true)
        }

        return { addEventListeners, removeEventListeners }
    }

    return { onClickOutside }
}
