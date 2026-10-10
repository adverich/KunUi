import { onBeforeUnmount, ref, watch, type Ref } from 'vue'

export type IntersectionCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void;

export interface IntersectionObserverOptionsLike {
    root?: Ref<Element | null> | Element | null;
    rootMargin?: string;
    threshold?: number | number[];
}

export function useIntersectionObserver(
    target: Element | null | undefined,
    callback: IntersectionCallback,
    options: IntersectionObserverOptionsLike = {},
) {
    const observer: Ref<IntersectionObserver | null> = ref(null)
    let retryTimeout: ReturnType<typeof setTimeout> | null = null

    const defaultOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0,
    }

    const observeElement = (): void => {
        const el = target;
        const rootOpt = options.root;
        const rootEl = (rootOpt as Ref<Element | null>)?.value || (rootOpt as Element) || null

        // console.log('[observeElement] el:', el)
        // console.log('[observeElement] rootEl:', rootEl)
        // console.log('[observeElement] observer.value:', observer.value)

        if (!el) {
            // console.warn('[observeElement] ❌ el (target.value) no está listo')

            // Opcional: reintenta después si el elemento aún no está disponible
            retryTimeout = setTimeout(() => {
                // console.log('[observeElement] 🔁 Reintentando...')
                observeElement()
            }, 100)
            return
        }

        if (observer.value) {
            // console.warn('[observeElement] ⚠️ ya hay un observer activo')
            return
        }

        if (retryTimeout) clearTimeout(retryTimeout)
        retryTimeout = null

        // console.log('[Observer] ✅ Observando el:', el, 'con root:', rootEl)

        observer.value = new IntersectionObserver(callback, {
            ...defaultOptions,
            ...options,
            root: rootEl as Element | null,
        })

        observer.value.observe(el)
    }

    const stopObserving = (): void => {
        if (observer.value) {
            // console.log('[Observer] 🔴 Desconectando observer')
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
        (el: Element | null | undefined) => {
            // console.log('[watch:target] target.value cambió:', el)

            stopObserving()

            requestAnimationFrame(() => {
                // console.log('[watch:target] requestAnimationFrame ejecutado')
                observeElement()
            })
        },
        { immediate: true }
    )

    // Watch root si es ref
    const rootOpt = options.root as Ref<Element | null> | undefined;
    if (options.root && rootOpt?.value !== undefined) {
        watch(
            () => rootOpt.value,
            (root: Element | null | undefined) => {
                // console.log('[watch:root] root.value cambió:', root)

                stopObserving()

                requestAnimationFrame(() => {
                    // console.log('[watch:root] requestAnimationFrame ejecutado')
                    observeElement()
                })
            }
        )
    }

    onBeforeUnmount(() => {
        // console.log('[Observer] 🧹 Limpieza en beforeUnmount')
        stopObserving()
    })
}
