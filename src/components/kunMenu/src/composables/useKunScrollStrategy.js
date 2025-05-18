import { onMounted, onBeforeUnmount, ref } from 'vue'

export function useKunScrollStrategy(props, hideMenu, positionMenu) {
    const lastScrollPosition = ref(0)

    function handleScroll() {
        switch (props.scrollStrategy) {
            case 'close':
                hideMenu()
                break
            case 'reposition':
                positionMenu()
                break
            case 'block':
                window.scrollTo(0, lastScrollPosition.value)
                break
            default:
                break
        }
    }

    onMounted(() => {
        lastScrollPosition.value = window.scrollY || window.pageYOffset
        window.addEventListener('scroll', handleScroll, true)
    })

    onBeforeUnmount(() => {
        window.removeEventListener('scroll', handleScroll, true)
    })
}