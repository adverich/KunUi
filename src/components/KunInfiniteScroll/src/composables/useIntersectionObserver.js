import { onMounted, onBeforeUnmount, ref, watch } from 'vue'

export function useIntersectionObserver(target, callback, options = {}) {
    const observer = ref(null)
    let retryTimeout = null

    const defaultOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0,
    }

    const observeElement = () => {
        const el = target;
        const rootEl = options.root?.value || options.root || null

        console.log('[observeElement] el:', el)
        console.log('[observeElement] rootEl:', rootEl)
        console.log('[observeElement] observer.value:', observer.value)

        if (!el) {
            console.warn('[observeElement] ❌ el (target.value) no está listo')

            // Opcional: reintenta después si el elemento aún no está disponible
            retryTimeout = setTimeout(() => {
                console.log('[observeElement] 🔁 Reintentando...')
                observeElement()
            }, 100)
            return
        }

        if (observer.value) {
            console.warn('[observeElement] ⚠️ ya hay un observer activo')
            return
        }

        clearTimeout(retryTimeout)
        retryTimeout = null

        console.log('[Observer] ✅ Observando el:', el, 'con root:', rootEl)

        observer.value = new IntersectionObserver(callback, {
            ...defaultOptions,
            ...options,
            root: rootEl,
        })

        observer.value.observe(el)
    }

    const stopObserving = () => {
        if (observer.value) {
            console.log('[Observer] 🔴 Desconectando observer')
            observer.value.disconnect()
            observer.value = null
        }

        if (retryTimeout) {
            clearTimeout(retryTimeout)
            retryTimeout = null
        }
    }

    // Watch target (sentinel)
    watch(
        () => target,
        (el) => {
            console.log('[watch:target] target.value cambió:', el)

            stopObserving()

            requestAnimationFrame(() => {
                console.log('[watch:target] requestAnimationFrame ejecutado')
                observeElement()
            })
        },
        { immediate: true }
    )

    // Watch root si es ref
    if (options.root && options.root.value !== undefined) {
        watch(
            () => options.root.value,
            (root) => {
                console.log('[watch:root] root.value cambió:', root)

                stopObserving()

                requestAnimationFrame(() => {
                    console.log('[watch:root] requestAnimationFrame ejecutado')
                    observeElement()
                })
            }
        )
    }

    onBeforeUnmount(() => {
        console.log('[Observer] 🧹 Limpieza en beforeUnmount')
        stopObserving()
    })
}