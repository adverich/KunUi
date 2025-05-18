export function useIntersect(handleIntersect, rootMargin = '0px', intersectObserved, menuModel, intersectRef) {
    const options = {
        root: null,
        rootMargin,
        threshold: 0.5,
    };

    const observer = new IntersectionObserver(handleIntersect, options);

    function observe() {
        if (intersectRef.value && !intersectObserved.value) {
            intersectObserved.value = true;
            observer.observe(intersectRef.value);
        } else {
            console.warn('El valor de intersectRef es nulo.');
        }
    }

    function stopObserver() {
        if (intersectRef.value) {
            intersectObserved.value = false;
            observer.unobserve(intersectRef.value);
        }
    }

    watch(menuModel, (value) => {
        if (!value && intersectObserved.value) {
            stopObserver();
        };
    });

    return {
        observe,
        stopObserver,
    };
}
