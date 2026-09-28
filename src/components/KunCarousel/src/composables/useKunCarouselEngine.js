import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

/**
 * useKunCarouselEngine — motor del carousel inspirado en Embla Carousel.
 *
 * Implementa nativamente (sin dependencias) las opciones y la API del core
 * de Embla v9 (con alias v8): snaps, drag con threshold, loop por índice,
 * containScroll, slidesToScroll (+ 'auto'), skipSnaps, dragFree, duration,
 * breakpoints por media query, slidesInView, autoplay integrado y métodos
 * goTo, goToNext, goToPrev, canGoToNext, selectedSnap, snapList, reInit, destroy.
 *
 * @param {object} ctx
 * @param {object} ctx.props - props reactivas (kunCarouselProps)
 * @param {Function} ctx.emit - emit del componente
 * @param {Ref<HTMLElement|null>} ctx.viewportRef
 * @param {Ref<HTMLElement|null>} ctx.containerRef
 */
export function useKunCarouselEngine({ props, emit, viewportRef, containerRef }) {
  const selectedIndex = ref(0)
  const previousIndex = ref(0)
  const snaps = ref([])
  const inView = ref([])
  const scrollProgressValue = ref(0)
  const canPrev = ref(false)
  const canNext = ref(false)
  const isDragging = ref(false)
  const isSettled = ref(true)
  const autoplayPlaying = ref(false)

  let destroyed = false
  let slideNodes = []
  let slideSizes = []
  let slideOffsets = []
  let viewportSize = 0
  let maxScroll = 0
  let location = 0
  let animating = false
  let transitionTimer = null
  let autoplayTimer = null
  let autoplayStoppedByInteraction = false
  let hoverPaused = false
  let resizeObserver = null
  let mutationObserver = null
  let inViewObserver = null
  let breakpointCleanups = []
  let breakpointActive = {}
  let dragState = null
  let velocitySamples = []
  // Estado del loop seamless (clones tipo Swiper/Embla SlideLooper)
  let originalNodes = []
  let cloneCount = 0
  let cloneSignature = ''
  let clonesMutating = false
  let wrapReplica = 0 // -1 | 0 | +1: réplica del clon en animación de wrap
  let baseOffset = 0 // desplazamiento de línea por clones antepuestos
  let snapFirstSlides = [] // por cada snap: primer slide original del grupo
  let loopMin = 0 // rango extendido real con clones (sin vacío)
  let loopMax = 0

  const isVertical = () => effectiveOptions.value.axis === 'y'
  const isRtl = () => !isVertical() && effectiveOptions.value.direction === 'rtl'

  // ------------------------------------------------------------------
  // Opciones efectivas: base + alias v8 + breakpoints por matchMedia
  // ------------------------------------------------------------------
  const BREAKPOINT_OVERRIDABLE = [
    'align',
    'slidesToScroll',
    'dragFree',
    'loop',
    'skipSnaps',
    'containScroll',
    'duration',
    'axis',
    'direction',
  ]

  function resolveBaseOptions() {
    const startSnap =
      props.startIndex !== undefined && props.startIndex !== null
        ? props.startIndex
        : (props.startSnap ?? 0)
    const draggable =
      props.watchDrag !== undefined && props.watchDrag !== null
        ? !!props.watchDrag && (typeof props.watchDrag !== 'function' || true)
        : props.draggable
    return {
      align: props.align ?? 'center',
      axis: props.axis ?? 'x',
      direction: props.direction ?? 'ltr',
      containScroll: props.containScroll ?? 'trimSnaps',
      slidesToScroll: props.slidesToScroll ?? 1,
      dragFree: props.dragFree ?? false,
      dragThreshold: props.dragThreshold ?? 10,
      loop: props.loop ?? false,
      skipSnaps: props.skipSnaps ?? false,
      duration: props.duration ?? 25,
      startSnap,
      active: props.active ?? true,
      draggable,
      resize: props.watchResize !== undefined && props.watchResize !== null ? !!props.watchResize : (props.resize ?? true),
      focus: props.watchFocus !== undefined && props.watchFocus !== null ? !!props.watchFocus : (props.focus ?? true),
      slideChanges:
        props.watchSlides !== undefined && props.watchSlides !== null ? !!props.watchSlides : (props.slideChanges ?? true),
    }
  }

  const effectiveOptions = computed(() => {
    const base = resolveBaseOptions()
    for (const key of Object.keys(breakpointActive)) {
      const override = breakpointActive[key]
      if (!override) continue
      for (const opt of BREAKPOINT_OVERRIDABLE) {
        if (override[opt] !== undefined) base[opt] = override[opt]
      }
    }
    return base
  })

  function setupBreakpoints() {
    breakpointCleanups.forEach((fn) => fn && fn())
    breakpointCleanups = []
    breakpointActive = {}
    if (typeof window === 'undefined' || !props.breakpoints) return
    const entries = Object.entries(props.breakpoints || {})
    if (!entries.length) return
    entries.forEach(([query, override]) => {
      try {
        const mql = window.matchMedia(query)
        const apply = () => {
          if (mql.matches) breakpointActive[query] = override
          else delete breakpointActive[query]
          scheduleMeasure()
        }
        apply()
        const onChange = () => apply()
        if (mql.addEventListener) {
          mql.addEventListener('change', onChange)
          breakpointCleanups.push(() => mql.removeEventListener('change', onChange))
        } else if (mql.addListener) {
          mql.addListener(onChange)
          breakpointCleanups.push(() => mql.removeListener(onChange))
        }
      } catch {
        // query inválida: se ignora
      }
    })
  }

  // ------------------------------------------------------------------
  // Medición + cálculo de snaps
  // ------------------------------------------------------------------
  function collectSlides() {
    const container = containerRef.value
    if (!container) return []
    return Array.from(container.children).filter((el) => el instanceof HTMLElement)
  }

  /**
   * Distancia acumulada de cada slide desde el inicio de la línea flex,
   * sumando tamaños + gap. Determinista en LTR, RTL y vertical.
   */
  function measureSlideOffsets(container, nodes, vertical) {
    let gapPx = 0
    try {
      const cs = window.getComputedStyle(container)
      const raw = vertical ? cs.rowGap || cs.gap : cs.columnGap || cs.gap
      const parsed = parseFloat(raw)
      gapPx = Number.isFinite(parsed) ? parsed : 0
    } catch {
      gapPx = 0
    }
    const offsets = []
    let acc = 0
    nodes.forEach((el, i) => {
      if (i > 0) acc += gapPx
      offsets.push(acc)
      acc += vertical ? el.offsetHeight : el.offsetWidth
    })
    return offsets
  }

  // ------------------------------------------------------------------
  // Loop seamless: clones de slides en ambos extremos.
  // Sin clones el wrap por índice nunca puede ser suave (rewind visible).
  // Con clones, cruzar el borde anima hacia el clon (continuo) y al hacer
  // settle se salta de forma invisible al original equivalente.
  // ------------------------------------------------------------------
  const CLONE_ATTR = 'data-kun-carousel-clone'

  function getOriginals() {
    const container = containerRef.value
    if (!container) return []
    return Array.from(container.children).filter(
      (el) => el instanceof HTMLElement && !el.hasAttribute(CLONE_ATTR)
    )
  }

  function clearClones() {
    const container = containerRef.value
    if (!container) return
    container.querySelectorAll(`[${CLONE_ATTR}]`).forEach((el) => el.remove())
  }

  function loopShouldBeActive(origCount, scrollable) {
    return (
      !!effectiveOptions.value.loop &&
      !!effectiveOptions.value.active &&
      origCount >= 2 &&
      scrollable > 1
    )
  }

  /** Cantidad de clones por lado: cubrir al menos el viewport. */
  function computeCloneCount(origSizes, gapPx) {
    const n = origSizes.length
    if (!n || !viewportSize) return 1
    let acc = 0
    for (let c = 0; c < n; c++) {
      if (c > 0) acc += gapPx
      acc += origSizes[c] || 0
      if (acc >= viewportSize - 1) return Math.max(1, c + 1)
    }
    return n
  }

  function gapOf(container, vertical) {
    try {
      const cs = window.getComputedStyle(container)
      const raw = vertical ? cs.rowGap || cs.gap : cs.columnGap || cs.gap
      const parsed = parseFloat(raw)
      return Number.isFinite(parsed) ? parsed : 0
    } catch {
      return 0
    }
  }

  function makeClone(source, origIndex) {
    const clone = source.cloneNode(true)
    clone.setAttribute(CLONE_ATTR, '1')
    clone.setAttribute('data-kun-carousel-orig', String(origIndex))
    clone.setAttribute('aria-hidden', 'true')
    try {
      clone.inert = true
    } catch {
      // inert no soportado: los clones quedan fuera del tab vía tabindex
      clone.querySelectorAll('a, button, input, select, textarea, [tabindex]').forEach((el) => {
        el.setAttribute('tabindex', '-1')
      })
    }
    if (clone.hasAttribute('id')) clone.removeAttribute('id')
    clone.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'))
    return clone
  }

  function buildLoopClones(origSizes, gapPx) {
    const container = containerRef.value
    if (!container) return
    const n = originalNodes.length
    const origTotal = origSizes.length
      ? origSizes.reduce((a, b) => a + (b || 0), 0) + gapPx * Math.max(0, origSizes.length - 1)
      : 0
    const wantLoop = loopShouldBeActive(n, origTotal - viewportSize)
    const wantK = wantLoop ? Math.min(n, computeCloneCount(origSizes, gapPx)) : 0
    const signature = `${wantLoop ? 1 : 0}|${n}|${wantK}|${effectiveOptions.value.active ? 1 : 0}`
    if (signature === cloneSignature) {
      cloneCount = wantK
      return
    }
    clonesMutating = true
    try {
      clearClones()
      cloneCount = 0
      if (wantLoop && wantK > 0) {
        const fragPre = document.createDocumentFragment()
        for (let i = n - wantK; i < n; i++) {
          fragPre.appendChild(makeClone(originalNodes[i], i))
        }
        container.insertBefore(fragPre, container.firstChild)
        const fragPost = document.createDocumentFragment()
        for (let i = 0; i < wantK; i++) {
          fragPost.appendChild(makeClone(originalNodes[i], i))
        }
        container.appendChild(fragPost)
        cloneCount = wantK
      }
      cloneSignature = signature
    } finally {
      setTimeout(() => {
        clonesMutating = false
      }, 0)
    }
  }

  /**
   * Posición de scroll de un cursor extendido en UNIDADES DE SNAP.
   * cursor en [-1, total] usa el clon del primer slide del grupo
   * (réplica -1/+1); dentro de [0, total-1] es el snap original.
   * Solo ±1 paso es válido: los clones cubren k>=1 slides por lado.
   */
  function extendedSnapPosition(cursorSnap) {
    const total = snaps.value.length
    const n = originalNodes.length
    if (!total || !n) return 0
    if (cursorSnap >= 0 && cursorSnap < total) return snaps.value[cursorSnap] ?? 0
    const replica = cursorSnap < 0 ? -1 : 1
    const mod = ((cursorSnap % total) + total) % total
    const firstSlide = snapFirstSlides[mod] ?? mod
    const k = cloneCount
    const vertical = isVertical()
    const allSizes = slideNodes.map((el) => (vertical ? el.offsetHeight : el.offsetWidth))
    const allOffsets = measureSlideOffsets(containerRef.value, slideNodes, vertical)
    let childIndex = -1
    if (replica < 0) {
      // clones antepuestos: últimos k originales en orden
      if (firstSlide >= n - k) childIndex = firstSlide - (n - k)
    } else {
      // clones pospuestos: primeros k originales
      if (firstSlide < k) childIndex = k + n + firstSlide
    }
    if (childIndex < 0 || childIndex >= allOffsets.length) {
      return snaps.value[mod] ?? 0
    }
    return (
      allOffsets[childIndex] -
      alignOffset(effectiveOptions.value.align, viewportSize, allSizes[childIndex] ?? 0, firstSlide)
    )
  }

  /** Salto invisible a la posición original equivalente (clon === original). */
  function normalizeWrap() {
    if (wrapReplica === 0) return
    wrapReplica = 0
    if (snaps.value.length) {
      location = snaps.value[selectedIndex.value] ?? location
      applyLocation(false)
    }
  }

  function alignOffset(align, viewSize, slideSize, index) {
    if (typeof align === 'function') {
      try {
        const v = Number(align(viewSize, slideSize, index))
        return Number.isFinite(v) ? v : 0
      } catch {
        return 0
      }
    }
    if (align === 'start') return 0
    if (align === 'end') return Math.max(0, viewSize - slideSize)
    return Math.max(0, (viewSize - slideSize) / 2)
  }

  function measure() {
    if (destroyed) return
    const viewport = viewportRef.value
    const container = containerRef.value
    if (!viewport || !container) return

    const vertical = isVertical()

    viewportSize = vertical ? viewport.clientHeight : viewport.clientWidth
    if (!viewportSize) viewportSize = 0

    // 1) Originales (sin clones): base de snaps, grupos y selección.
    originalNodes = getOriginals()
    const n = originalNodes.length
    const opts = effectiveOptions.value
    const gapPx = gapOf(container, vertical)
    const origSizes = originalNodes.map((el) => (vertical ? el.offsetHeight : el.offsetWidth))
    // Offsets relativos al primer original (los originales son un bloque
    // contiguo; los clones solo desplazan la línea, compensado con preWidth).
    const origOffsets = measureSlideOffsets(container, originalNodes, vertical)

    // 2) Clones del loop (solo rebuild si cambia la firma).
    buildLoopClones(origSizes, gapPx)

    // 3) Todos los hijos (clones + originales) para posiciones reales.
    slideNodes = collectSlides()
    const k = cloneCount
    const allSizes = slideNodes.map((el) => (vertical ? el.offsetHeight : el.offsetWidth))
    const allOffsets = measureSlideOffsets(container, slideNodes, vertical)
    // Offsets de originales = acumulados + desplazamiento de los clones previos.
    const preWidth = k > 0 ? (allOffsets[k] ?? 0) : 0
    slideSizes = [...origSizes]
    slideOffsets = origOffsets.map((o) => o + preWidth)

    const rawSnaps = originalNodes.map((_, i) => slideOffsets[i] - alignOffset(opts.align, viewportSize, slideSizes[i], i))

    // Agrupar por slidesToScroll
    let groups = []
    if (opts.slidesToScroll === 'auto') {
      let current = [0]
      groups = [current]
      for (let i = 1; i < n; i++) {
        if (slideOffsets[i] - slideOffsets[current[0]] >= viewportSize - 1) {
          current = [i]
          groups.push(current)
        } else {
          current.push(i)
        }
      }
    } else {
      const per = Math.max(1, Math.floor(opts.slidesToScroll) || 1)
      for (let i = 0; i < n; i += per) {
        groups.push(originalNodes.slice(i, i + per).map((_, k) => i + k))
      }
    }

    let list = groups.map((g) => rawSnaps[g[0]] ?? 0)
    let keptGroups = groups

    // Rango scrolleable de los ORIGINALES (sin clones).
    const origTotal = n
      ? origSizes.reduce((a, b) => a + (b || 0), 0) + gapPx * Math.max(0, n - 1)
      : 0
    maxScroll = Math.max(0, origTotal - viewportSize)

    const eps = 1
    if (opts.loop && canLoop(list)) {
      // En loop no se contiene: todos los snaps son navegables
    } else if (opts.containScroll === 'trimSnaps') {
      keptGroups = groups.filter((g) => {
        const s = rawSnaps[g[0]] ?? 0
        return s >= -eps && s <= maxScroll + eps
      })
      if (!keptGroups.length) {
        keptGroups = groups.length ? [groups[0]] : []
        list = [0]
      } else {
        list = keptGroups.map((g) => rawSnaps[g[0]] ?? 0)
      }
    } else if (opts.containScroll === 'keepSnaps') {
      if (!list.length) list = [0]
      // se conservan todos; la posición se clamp al rango alcanzable
    } else {
      if (!list.length) list = [0]
    }

    snaps.value = list
    snapFirstSlides = keptGroups.map((g) => g[0] ?? 0)
    baseOffset = preWidth
    // Rango extendido del loop: snaps de los clones extremos (contenido real).
    if (cloneCount > 0 && allOffsets.length) {
      const last = allOffsets.length - 1
      loopMin = allOffsets[0] - alignOffset(opts.align, viewportSize, allSizes[0] ?? 0, 0)
      loopMax = allOffsets[last] - alignOffset(opts.align, viewportSize, allSizes[last] ?? 0, n - 1)
      if (loopMax < loopMin) {
        const t = loopMin
        loopMin = loopMax
        loopMax = t
      }
    } else {
      loopMin = 0
      loopMax = 0
    }
    updateInView(true)
    clampSelection()
    if (!dragState && !animating && snaps.value.length) {
      // re-anclar al snap seleccionado (estable ante resize / toggle de loop)
      location = clampLocation(snaps.value[selectedIndex.value] ?? 0)
    }
    applyLocation(false)
    updateFlags()
  }

  function canLoop(list = snaps.value) {
    if (originalNodes.length < 2) return false
    if (maxScroll <= 1) return false
    return list.length > 1
  }

  function isLoopEnabled() {
    return !!effectiveOptions.value.loop && canLoop()
  }

  let measureQueued = false
  function scheduleMeasure() {
    if (measureQueued) return
    measureQueued = true
    requestAnimationFrame(() => {
      measureQueued = false
      measure()
    })
  }

  function clampLocation(loc) {
    if (isLoopEnabled() && cloneCount > 0) {
      // con clones el rango extendido es contenido real: sin wrap ni vacío
      return Math.min(loopMax, Math.max(loopMin, loc))
    }
    if (!snaps.value.length) return 0
    // Paridad Embla (ScrollBounds): la POSICIÓN siempre se clamp al rango
    // alcanzable [min(0, snaps), maxScroll]. keepSnaps/false conservan snaps
    // más allá (dots/selección), pero descansan en el borde, sin vacío.
    const min = Math.min(0, ...snaps.value)
    const max = Math.max(maxScroll, 0)
    return Math.min(max, Math.max(min, loc))
  }

  function snapRangeProgress(loc) {
    if (snaps.value.length < 2) return 0
    const min = Math.min(...snaps.value)
    const max = Math.max(...snaps.value)
    const span = max - min
    if (span <= 0) return 0
    return Math.min(1, Math.max(0, (loc - min) / span))
  }

  function clampSelection() {
    if (!snaps.value.length) {
      selectedIndex.value = 0
      return
    }
    selectedIndex.value = Math.min(Math.max(selectedIndex.value, 0), snaps.value.length - 1)
  }

  // ------------------------------------------------------------------
  // Render: aplica translate al container
  // ------------------------------------------------------------------
  function transitionMs() {
    const d = Number(effectiveOptions.value.duration) || 0
    if (d <= 0) return 0
    return Math.round(d * 16)
  }

  function applyLocation(animated) {
    const container = containerRef.value
    if (!container) return
    const loc = location
    const rtl = isRtl()
    const vertical = isVertical()
    let x = 0
    let y = 0
    if (vertical) y = -loc
    else x = rtl ? loc : -loc
    container.style.transitionProperty = 'transform'
    container.style.transitionTimingFunction = 'cubic-bezier(0.22, 0.61, 0.21, 1)'
    container.style.transitionDuration = animated ? `${transitionMs()}ms` : '0ms'
    container.style.transform = `translate3d(${x}px, ${y}px, 0)`
    // Progreso 0 en el primer snap y 1 en el último: siempre alcanzable,
    // incluso cuando el último snap no llega a maxScroll (snaps recortados).
    scrollProgressValue.value = snapRangeProgress(loc)
  }

  function animateTo(target, instant = false) {
    const container = containerRef.value
    if (!container) return
    clearTimeout(transitionTimer)
    animating = true
    isSettled.value = false
    applyLocationWith(target, !instant && transitionMs() > 0)
    const ms = !instant ? transitionMs() : 0
    if (ms <= 0) {
      onSettled()
    } else {
      transitionTimer = setTimeout(onSettled, ms + 30)
    }
  }

  function applyLocationWith(target, animated) {
    location = target
    applyLocation(animated)
    emit('scroll', scrollProgressValue.value)
    updateFlags()
  }

  function onSettled() {
    animating = false
    isSettled.value = true
    // si se animó hacia un clon (wrap), volver invisible al original
    normalizeWrap()
    updateFlags()
    emit('settle', api, selectedIndex.value)
  }

  function updateFlags() {
    if (isLoopEnabled()) {
      canPrev.value = originalNodes.length > 0
      canNext.value = originalNodes.length > 0
    } else {
      canPrev.value = selectedIndex.value > 0
      canNext.value = selectedIndex.value < snaps.value.length - 1
    }
  }

  function setSelected(index, instant = false) {
    if (!snaps.value.length) return
    // si venía de un wrap, consolidar primero (invisible)
    normalizeWrap()
    const total = snaps.value.length
    let next = index
    if (isLoopEnabled()) {
      next = ((index % total) + total) % total
    } else {
      next = Math.min(Math.max(index, 0), total - 1)
    }
    const changed = next !== selectedIndex.value
    if (changed) {
      previousIndex.value = selectedIndex.value
      selectedIndex.value = next
      emit('update:modelValue', next)
      emit('select', api, next)
    } else if (Math.abs(location - (snaps.value[next] ?? location)) < 0.5) {
      // mismo snap y ya posicionado: no reiniciar la animación
      updateFlags()
      return
    }
    // la posición descansa en el rango alcanzable (snaps más allá del bound
    // no generan vacío: es la semántica keepSnaps de Embla)
    animateTo(clampLocation(snaps.value[next]), instant)
  }

  /**
   * Navegación a un cursor extendido (±1 paso fuera de [0, total)): anima
   * hacia el clon (movimiento continuo) y al hacer settle salta invisible
   * al original. Cursores dentro del rango van directo al snap.
   */
  function goToExtended(cursorSnap, instant = false) {
    if (!snaps.value.length || !isLoopEnabled()) return
    normalizeWrap()
    const total = snaps.value.length
    if (cursorSnap >= 0 && cursorSnap < total) {
      setSelected(cursorSnap, instant)
      return
    }
    if (cloneCount < 1) {
      setSelected(((cursorSnap % total) + total) % total, instant)
      return
    }
    const mod = ((cursorSnap % total) + total) % total
    const target = extendedSnapPosition(cursorSnap)
    previousIndex.value = selectedIndex.value
    selectedIndex.value = mod
    wrapReplica = cursorSnap < 0 ? -1 : 1
    emit('update:modelValue', mod)
    emit('select', api, mod)
    animateTo(target, instant)
  }

  /**
   * Cruce de borde en loop: un paso en la dirección indicada, por el clon
   * si se está en el borde (seamless) o directo si no.
   */
  function goToWrap(dir, instant = false) {
    if (!snaps.value.length || !isLoopEnabled()) return
    const total = snaps.value.length
    const from = selectedIndex.value
    const atEdge = dir > 0 ? from === total - 1 : from === 0
    if (!atEdge) {
      setSelected(from + dir, instant)
      return
    }
    goToExtended(dir > 0 ? total : -1, instant)
  }

  /**
   * Settle libre (dragFree): la posición queda donde soltó el puntero
   * (con proyección por velocidad), sin forzar snap. El snap seleccionado
   * se actualiza al más cercano solo para dots / v-model / eventos.
   */
  function settleFree(loc) {
    if (!snaps.value.length) return
    normalizeWrap()
    const nearest = nearestSnapIndex(loc)
    if (nearest !== selectedIndex.value) {
      previousIndex.value = selectedIndex.value
      selectedIndex.value = nearest
      emit('update:modelValue', nearest)
      emit('select', api, nearest)
    }
    animateTo(loc, false)
  }

  // ------------------------------------------------------------------
  // API pública (paridad Embla v9 + alias v8)
  // ------------------------------------------------------------------
  function snapIndex(offset) {
    if (!snaps.value.length) return 0
    const total = snaps.value.length
    let next = selectedIndex.value + (offset || 0)
    if (isLoopEnabled()) next = ((next % total) + total) % total
    else next = Math.min(Math.max(next, 0), total - 1)
    return next
  }

  function goTo(index, instant = false) {
    if (destroyed || !effectiveOptions.value.active) return
    if (!snaps.value.length) return
    setSelected(index, instant === true)
  }

  function goToNext(instant = false) {
    if (isLoopEnabled() && instant !== true) goToWrap(1)
    else goTo(snapIndex(1), instant === true)
  }

  function goToPrev(instant = false) {
    if (isLoopEnabled() && instant !== true) goToWrap(-1)
    else goTo(snapIndex(-1), instant === true)
  }

  function canGoToNext() {
    if (!snaps.value.length) return false
    if (isLoopEnabled()) return originalNodes.length > 0
    return selectedIndex.value < snaps.value.length - 1
  }

  function canGoToPrev() {
    if (!snaps.value.length) return false
    if (isLoopEnabled()) return originalNodes.length > 0
    return selectedIndex.value > 0
  }

  const api = {
    // v9
    goToNext,
    goToPrev,
    goTo,
    canGoToNext,
    canGoToPrev,
    selectedSnap: () => selectedIndex.value,
    previousSnap: () => previousIndex.value,
    snapList: () => [...snaps.value],
    snapIndex,
    scrollProgress: () => scrollProgressValue.value,
    slidesInView: () => [...inView.value],
    slidesNotInView: () =>
      originalNodes.map((_, i) => i).filter((i) => !inView.value.includes(i)),
    reInit,
    destroy,
    rootNode: () => viewportRef.value,
    containerNode: () => containerRef.value,
    slideNodes: () => [...originalNodes],
    play: startAutoplay,
    stop: stopAutoplay,
    // alias v8
    scrollNext: (jump) => goToNext(jump === true),
    scrollPrev: (jump) => goToPrev(jump === true),
    scrollTo: (index, jump) => goTo(index, jump === true),
    canScrollNext: () => api.canGoToNext(),
    canScrollPrev: () => api.canGoToPrev(),
    selectedScrollSnap: () => selectedIndex.value,
    previousScrollSnap: () => previousIndex.value,
    scrollSnapList: () => [...snaps.value],
    reinit: (...args) => reInit(...args),
  }

  function reInit() {
    if (destroyed) return
    // forzar rebuild de clones: el contenido de los slides pudo cambiar
    cloneSignature = ''
    measure()
    emit('reinit', api)
  }

  function destroy() {
    if (destroyed) return
    destroyed = true
    stopAutoplay(true)
    clearTimeout(transitionTimer)
    detachPointer()
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
    if (mutationObserver) {
      mutationObserver.disconnect()
      mutationObserver = null
    }
    if (inViewObserver) {
      inViewObserver.disconnect()
      inViewObserver = null
    }
    breakpointCleanups.forEach((fn) => fn && fn())
    breakpointCleanups = []
    try {
      clearClones()
    } catch {
      // DOM ya desmontado
    }
    cloneCount = 0
    cloneSignature = ''
    emit('destroy', api)
  }

  // ------------------------------------------------------------------
  // Drag (pointer events)
  // ------------------------------------------------------------------
  function pointAlongAxis(e) {
    return isVertical() ? e.clientY : e.clientX
  }

  function onPointerDown(e) {
    if (destroyed || !effectiveOptions.value.active) return
    const opts = effectiveOptions.value
    const dragEnabled = typeof opts.draggable === 'function' ? true : !!opts.draggable
    if (!dragEnabled) return
    if (e.pointerType === 'mouse' && e.button !== 0) return
    emit('pointerdown', api, e)
    if (props.stopOnInteraction) interactionStop()
    stopAutoplayTick()
    // consolidar un wrap pendiente: el clon y el original son idénticos,
    // el salto es invisible y el drag parte de la posición canónica
    normalizeWrap()
    dragState = {
      startPoint: pointAlongAxis(e),
      startLocation: location,
      pointerId: e.pointerId,
      moved: false,
      startSnap: selectedIndex.value,
    }
    velocitySamples = [{ p: dragState.startPoint, t: performance.now() }]
    // NOTA: no se captura el puntero acá. setPointerCapture retargetea el
    // click al viewport y rompería botones/links dentro de los slides.
    // Se captura recién cuando el gesto supera el threshold (drag real).
  }

  function onPointerMove(e) {
    if (!dragState || dragState.pointerId !== e.pointerId) return
    const opts = effectiveOptions.value
    const current = pointAlongAxis(e)
    let delta = current - dragState.startPoint
    if (isRtl()) delta = -delta
    if (!dragState.moved && Math.abs(current - dragState.startPoint) < (opts.dragThreshold ?? 10)) {
      return
    }
    if (!dragState.moved) {
      dragState.moved = true
      isDragging.value = true
      clearTimeout(transitionTimer)
      animating = false
      // drag real: ahora sí capturar el puntero para seguirlo fuera del viewport
      try {
        viewportRef.value?.setPointerCapture?.(dragState.pointerId)
      } catch {
        // sin captura disponible
      }
    }
    emit('pointermove', api, e)
    // desplazamiento total ajustado (con signo RTL): >0 = gesto a la derecha,
    // <0 = gesto a la izquierda. Es la fuente de verdad para la dirección,
    // incluso cuando `location` hace wrap en loop.
    dragState.totalDelta = delta
    const now = performance.now()
    velocitySamples.push({ p: current, t: now })
    if (velocitySamples.length > 6) velocitySamples.shift()

    let target = dragState.startLocation - delta
    if (!isLoopEnabled()) {
      const min = Math.min(0, ...(snaps.value.length ? snaps.value : [0]))
      const max = Math.max(maxScroll, 0)
      if (target < min) target = min + (target - min) * 0.35
      if (target > max) target = max + (target - max) * 0.35
    } else if (snaps.value.length) {
      target = clampLocation(target)
    }
    location = target
    applyLocation(false)
    emit('scroll', scrollProgressValue.value)
  }

  function dragVelocity() {
    if (velocitySamples.length < 2) return 0
    const first = velocitySamples[0]
    const last = velocitySamples[velocitySamples.length - 1]
    const dt = Math.max(1, last.t - first.t)
    let v = (last.p - first.p) / dt // px por ms
    if (isRtl()) v = -v
    return v
  }

  function nearestSnapIndex(loc) {
    let best = 0
    let bestDist = Infinity
    snaps.value.forEach((s, i) => {
      const d = Math.abs(s - loc)
      if (d < bestDist) {
        bestDist = d
        best = i
      }
    })
    return best
  }

  function onPointerUp(e) {
    if (!dragState || dragState.pointerId !== e.pointerId) return
    const wasMoved = dragState.moved
    const startSnap = dragState.startSnap
    const totalDelta = dragState.totalDelta ?? 0
    const velocity = dragVelocity()
    dragState = null
    isDragging.value = false
    emit('pointerup', api, e)
    if (!wasMoved) {
      restartAutoplayTick()
      return
    }
    const opts = effectiveOptions.value
    if (!snaps.value.length) return

    if (opts.dragFree) {
      const projected = clampLocation(location - velocity * 140)
      settleFree(projected)
    } else {
      const spacing = snaps.value.length > 1
        ? Math.abs(snaps.value[Math.min(startSnap + 1, snaps.value.length - 1)] - snaps.value[startSnap]) ||
          Math.abs(snaps.value[1] - snaps.value[0])
        : viewportSize || 1
      const threshold = Math.max(spacing * 0.2, opts.dragThreshold ?? 10)
      let target
      if (Math.abs(totalDelta) <= threshold) {
        // gesto corto: vuelve al snap de origen
        target = startSnap
      } else {
        // gesto a la derecha = anterior, a la izquierda = siguiente
        // (delta ya contempla RTL). En loop hace wrap correctamente.
        const dir = totalDelta > 0 ? -1 : 1
        if (isLoopEnabled() && cloneCount >= 1) {
          const total = snaps.value.length
          const step = opts.skipSnaps
            ? 1 + Math.min(total - 1, Math.floor(Math.abs(velocity) * 6))
            : 1
          // Candidatos en unidades de snap extendidas: el rango ±step
          // alrededor del origen. Fuera de [0, total) usan clones (continuo),
          // dentro van directo. Gana la posición más cercana al puntero.
          const lo = Math.max(-1, startSnap - step)
          const hi = Math.min(total, startSnap + step)
          let best = startSnap
          let bestDist = Math.abs(location - snaps.value[startSnap])
          for (let c = lo; c <= hi; c++) {
            if (c === startSnap) continue
            const pos = c < 0 || c >= total ? extendedSnapPosition(c) : snaps.value[c]
            const d = Math.abs(location - pos)
            // desempate: preferir la dirección del gesto
            const dirOk = (c > startSnap && totalDelta < 0) || (c < startSnap && totalDelta > 0)
            if (d < bestDist - 0.5 || (Math.abs(d - bestDist) <= 0.5 && dirOk)) {
              bestDist = d
              best = c
            }
          }
          if (best === startSnap || Math.abs(totalDelta) <= threshold) {
            setSelected(startSnap, false)
          } else if (best < 0 || best >= total) {
            goToExtended(best)
          } else {
            setSelected(best, false)
          }
          restartAutoplayTick()
          return
        } else if (opts.skipSnaps) {
          const extra = Math.min(snaps.value.length - 1, Math.floor(Math.abs(velocity) * 6))
          target = Math.min(Math.max(startSnap + dir * (1 + extra), 0), snaps.value.length - 1)
        } else {
          target = Math.min(Math.max(startSnap + dir, 0), snaps.value.length - 1)
        }
      }
      setSelected(target, false)
    }
    restartAutoplayTick()
  }

  function onPointerCancel(e) {
    if (!dragState) return
    dragState = null
    isDragging.value = false
    normalizeWrap()
    // vuelve al snap actual
    if (snaps.value.length) animateTo(snaps.value[selectedIndex.value], false)
    restartAutoplayTick()
  }

  function attachPointer() {
    const viewport = viewportRef.value
    if (!viewport) return
    viewport.addEventListener('pointerdown', onPointerDown)
    viewport.addEventListener('pointermove', onPointerMove)
    viewport.addEventListener('pointerup', onPointerUp)
    viewport.addEventListener('pointercancel', onPointerCancel)
  }

  function detachPointer() {
    const viewport = viewportRef.value
    if (!viewport) return
    viewport.removeEventListener('pointerdown', onPointerDown)
    viewport.removeEventListener('pointermove', onPointerMove)
    viewport.removeEventListener('pointerup', onPointerUp)
    viewport.removeEventListener('pointercancel', onPointerCancel)
  }

  // ------------------------------------------------------------------
  // slidesInView (IntersectionObserver)
  // ------------------------------------------------------------------
  function setupInView() {
    if (inViewObserver) {
      inViewObserver.disconnect()
      inViewObserver = null
    }
    const viewport = viewportRef.value
    if (!viewport || typeof IntersectionObserver === 'undefined') {
      inView.value = originalNodes.map((_, i) => i)
      return
    }
    const threshold = Number(props.inViewThreshold) || 0
    inViewObserver = new IntersectionObserver(
      (entries) => {
        const visible = []
        entries.forEach((entry) => {
          const idx = originalNodes.indexOf(entry.target)
          if (idx === -1) return
          const ratio = entry.intersectionRatio ?? 0
          if (entry.isIntersecting && ratio >= threshold) visible.push(idx)
        })
        // combinar con estado actual para entradas no reportadas
        const current = new Set(inView.value)
        entries.forEach((entry) => {
          const idx = originalNodes.indexOf(entry.target)
          if (idx === -1) return
          const ratio = entry.intersectionRatio ?? 0
          if (entry.isIntersecting && ratio >= threshold) current.add(idx)
          else current.delete(idx)
        })
        void visible
        inView.value = [...current].sort((a, b) => a - b)
        emit('slidesinview', api, [...inView.value])
      },
      { root: viewport, threshold: threshold > 0 ? [0, threshold, 1] : [0], rootMargin: props.inViewMargin || '0px' }
    )
    originalNodes.forEach((el) => inViewObserver.observe(el))
  }

  function updateInView(full = false) {
    setupInView()
    if (full && (!inView.value.length || typeof IntersectionObserver === 'undefined')) {
      inView.value = originalNodes.map((_, i) => i)
    }
  }

  // ------------------------------------------------------------------
  // Autoplay integrado (equivale al plugin embla-carousel-autoplay)
  // ------------------------------------------------------------------
  function startAutoplay() {
    if (destroyed) return
    if (!props.autoplay) return
    autoplayStoppedByInteraction = false
    if (autoplayTimer || hoverPaused || !dragStateFree()) return
    autoplayPlaying.value = true
    autoplayTimer = setInterval(() => {
      if (destroyed || !props.autoplay || autoplayStoppedByInteraction || hoverPaused || dragState) return
      const dir = props.autoplayDirection === -1 ? -1 : 1
      if (dir === 1) {
        if (canGoToNext()) goToNext()
        else if (!isLoopEnabled()) goTo(0)
      } else {
        if (canGoToPrev()) goToPrev()
        else if (!isLoopEnabled()) goTo(snaps.value.length - 1)
      }
      emit('autoplay:play', api)
    }, Math.max(500, props.autoplayDelay ?? 3000))
  }

  function dragStateFree() {
    return !dragState
  }

  function stopAutoplay(silent = false) {
    if (autoplayTimer) {
      clearInterval(autoplayTimer)
      autoplayTimer = null
    }
    if (autoplayPlaying.value && !silent) emit('autoplay:stop', api)
    autoplayPlaying.value = false
  }

  function stopAutoplayTick() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer)
      autoplayTimer = null
    }
    autoplayPlaying.value = false
  }

  function restartAutoplayTick() {
    if (destroyed || !props.autoplay || autoplayStoppedByInteraction || hoverPaused) return
    if (autoplayTimer) return
    autoplayPlaying.value = true
    startAutoplayContinuation()
  }

  function startAutoplayContinuation() {
    if (autoplayTimer) return
    autoplayPlaying.value = true
    autoplayTimer = setInterval(() => {
      if (destroyed || !props.autoplay || autoplayStoppedByInteraction || hoverPaused || dragState) return
      const dir = props.autoplayDirection === -1 ? -1 : 1
      if (dir === 1) {
        if (canGoToNext()) goToNext()
        else if (!isLoopEnabled()) goTo(0)
      } else {
        if (canGoToPrev()) goToPrev()
        else if (!isLoopEnabled()) goTo(snaps.value.length - 1)
      }
    }, Math.max(500, props.autoplayDelay ?? 3000))
  }

  function interactionStop() {
    if (!props.autoplay || !props.stopOnInteraction) return
    autoplayStoppedByInteraction = true
    stopAutoplayTick()
    emit('autoplay:interaction', api, { stopped: true })
  }

  function onMouseEnter() {
    if (!props.autoplay || !props.stopOnMouseEnter) return
    hoverPaused = true
    stopAutoplayTick()
  }

  function onMouseLeave() {
    if (!props.autoplay || !props.stopOnMouseEnter) return
    hoverPaused = false
    if (!autoplayStoppedByInteraction) restartAutoplayTick()
  }

  // ------------------------------------------------------------------
  // Focus / keyboard / resize / slides observer
  // ------------------------------------------------------------------
  function onFocusIn(e) {
    if (!effectiveOptions.value.focus) return
    if (animating || dragState) return
    const container = containerRef.value
    if (!container || !container.contains(e.target)) return
    const slideEl = e.target.closest?.('[data-kun-carousel-slide]')
    // los clones espejan originales: mapear al índice original
    let idx = slideEl ? originalNodes.indexOf(slideEl) : -1
    if (idx === -1 && slideEl?.hasAttribute?.(CLONE_ATTR)) {
      idx = Number(slideEl.getAttribute('data-kun-carousel-orig'))
      if (!Number.isInteger(idx)) idx = -1
    }
    if (idx === -1) return
    // mapear slide -> snap (primer snap cuyo grupo contiene el slide)
    const snap = slideToSnap(idx)
    if (snap !== -1 && snap !== selectedIndex.value) {
      emit('slidefocus', api, e)
      setSelected(snap)
    }
  }

  function slideToSnap(slideIdx) {
    // reconstruir grupos igual que en measure para mapear
    const opts = effectiveOptions.value
    const n = originalNodes.length
    if (!n) return -1
    let groups = []
    if (opts.slidesToScroll === 'auto') {
      let current = [0]
      groups = [current]
      for (let i = 1; i < n; i++) {
        if (slideOffsets[i] - slideOffsets[current[0]] >= viewportSize - 1) {
          current = [i]
          groups.push(current)
        } else current.push(i)
      }
    } else {
      const per = Math.max(1, Math.floor(opts.slidesToScroll) || 1)
      for (let i = 0; i < n; i += per) groups.push(originalNodes.slice(i, i + per).map((_, k) => i + k))
    }
    // aplicar el mismo trim que snapList para alinear índices
    // (offsets relativos: slideOffsets incluye baseOffset por los clones)
    const eps = 1
    let kept = groups
    if (!isLoopEnabled() && opts.containScroll === 'trimSnaps' && groups.length) {
      const raw = groups.map((g) => slideOffsets[g[0]] - baseOffset - alignOffset(opts.align, viewportSize, slideSizes[g[0]], g[0]))
      kept = groups.filter((_, gi) => raw[gi] >= -eps && raw[gi] <= maxScroll + eps)
      if (!kept.length) kept = [groups[0]]
    }
    for (let s = 0; s < kept.length; s++) {
      if (kept[s].includes(slideIdx)) return s
    }
    return -1
  }

  function onKeyDown(e) {
    if (!props.keyboard) return
    if (destroyed || !effectiveOptions.value.active) return
    const vertical = isVertical()
    let dir = 0
    if (!vertical && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      dir = e.key === 'ArrowRight' ? 1 : -1
      if (isRtl()) dir = -dir
    } else if (vertical && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      dir = e.key === 'ArrowDown' ? 1 : -1
    } else if (e.key === 'Home') {
      e.preventDefault()
      if (props.stopOnInteraction) interactionStop()
      goTo(0)
      return
    } else if (e.key === 'End') {
      e.preventDefault()
      if (props.stopOnInteraction) interactionStop()
      goTo(snaps.value.length - 1)
      return
    } else {
      return
    }
    e.preventDefault()
    if (props.stopOnInteraction) interactionStop()
    if (dir === 1) goToNext()
    else goToPrev()
  }

  function onNativeDragStart(e) {
    // evita el ghost-drag nativo de imágenes durante el drag por puntero
    e.preventDefault()
  }

  function setupObservers() {
    const viewport = viewportRef.value
    const container = containerRef.value
    if (!viewport || !container) return
    const watchResize = effectiveOptions.value.resize
    if (watchResize && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => scheduleMeasure())
      resizeObserver.observe(viewport)
      resizeObserver.observe(container)
    }
    if (effectiveOptions.value.slideChanges && typeof MutationObserver !== 'undefined') {
      mutationObserver = new MutationObserver((records) => {
        // ignorar las mutaciones provocadas por nuestros propios clones
        if (clonesMutating) return
        scheduleMeasure()
        nextTick(() => {
          setupInView()
          emit('slideschanged', api, records)
        })
      })
      mutationObserver.observe(container, { childList: true })
    }
    viewport.addEventListener('focusin', onFocusIn)
    viewport.addEventListener('keydown', onKeyDown)
    viewport.addEventListener('mouseenter', onMouseEnter)
    viewport.addEventListener('mouseleave', onMouseLeave)
    viewport.addEventListener('dragstart', onNativeDragStart)
  }

  function teardownViewportListeners() {
    const viewport = viewportRef.value
    if (!viewport) return
    viewport.removeEventListener('focusin', onFocusIn)
    viewport.removeEventListener('keydown', onKeyDown)
    viewport.removeEventListener('mouseenter', onMouseEnter)
    viewport.removeEventListener('mouseleave', onMouseLeave)
    viewport.removeEventListener('dragstart', onNativeDragStart)
  }

  // ------------------------------------------------------------------
  // Ciclo de vida
  // ------------------------------------------------------------------
  async function init() {
    setupBreakpoints()
    attachPointer()
    setupObservers()
    await nextTick()
    measure()
    const start = Math.min(
      Math.max(effectiveOptions.value.startSnap ?? 0, 0),
      Math.max(0, snaps.value.length - 1)
    )
    if (props.modelValue !== undefined && props.modelValue !== null) {
      selectedIndex.value = Math.min(Math.max(props.modelValue, 0), Math.max(0, snaps.value.length - 1))
    } else {
      selectedIndex.value = start
    }
    previousIndex.value = selectedIndex.value
    if (snaps.value.length) {
      location = snaps.value[selectedIndex.value] ?? 0
      applyLocation(false)
    }
    updateFlags()
    if (props.autoplay && props.playOnInit) startAutoplay()
    window.addEventListener('resize', scheduleMeasure)
  }

  onMounted(init)

  onBeforeUnmount(() => {
    window.removeEventListener('resize', scheduleMeasure)
    teardownViewportListeners()
    destroy()
  })

  // v-model externo
  watch(
    () => props.modelValue,
    (v) => {
      if (v === undefined || v === null || destroyed) return
      if (v !== selectedIndex.value && snaps.value.length) goTo(v)
    }
  )

  // re-mediar ante cambios de opciones layout-relevantes
  watch(
    () => [
      props.align,
      props.axis,
      props.direction,
      props.containScroll,
      props.slidesToScroll,
      props.dragFree,
      props.loop,
      props.active,
      props.skipSnaps,
      props.slideSize,
      props.gap,
      props.breakpoints,
    ],
    () => {
      setupBreakpoints()
      scheduleMeasure()
    }
  )

  watch(
    () => [props.autoplay, props.autoplayDelay, props.autoplayDirection],
    () => {
      stopAutoplayTick()
      autoplayStoppedByInteraction = false
      if (props.autoplay && props.playOnInit) startAutoplay()
    }
  )

  return {
    api,
    selectedIndex,
    previousIndex,
    snaps,
    inView,
    scrollProgress: scrollProgressValue,
    canPrev,
    canNext,
    isDragging,
    isSettled,
    autoplayPlaying,
    effectiveOptions,
    reInit,
  }
}

export default useKunCarouselEngine
