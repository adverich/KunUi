// Muesca del borde con label flotante, compartida por los fields con variante
// `outline` (KunTextField, KunNumberField, KunTextarea).
//
// Estrategia: el overlay dibuja el borde nativo completo (el navegador respeta
// cualquier `rounded`, pill incluida, sin costuras ni arcos incompletos) y la
// muesca se recorta con `mask`: capa 1 = todo negro, capa 2 = rectángulo sobre
// la caja real del label que se resta (`mask-composite: exclude`).
// Además el label flotante se desplaza 2px por escalón de `rounded` para
// separarlo de la curva (espejado si flota anclado a la derecha).
//
// Sin fieldset/legend: idéntico en todos los navegadores. Hueco real en
// cualquier fondo (el label es transparente).
//
// La muesca se re-mide al terminar las transiciones del label
// (`transitionend`: la medición en `nextTick` puede caer a mitad de la
// animación del margen/tamaño y quedar corrida) y cuando el field cambia de
// tamaño (`ResizeObserver` sobre label + overlay).

import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import type { Ref, ComputedRef, WatchSource } from 'vue';
import { installKunNotchDebug } from './kunNotchDebug.js';

export interface KunFieldNotchOptions {
  /** El label está flotando (foco / valor / placeholder / dirty). */
  isFloating: () => boolean;
  /** Hay label (texto). */
  hasLabel: () => unknown;
  /** Clase de posición resuelta del label (detecta anclaje `right-*`). */
  labelLeftClass: () => string;
  /** Clase de `rounded` resuelta del overlay (para el desplazamiento). */
  roundedClass: () => string | undefined;
}

export interface KunFieldNotchApi {
  labelRef: Ref<HTMLLabelElement | null>;
  overlayRef: Ref<HTMLDivElement | null>;
  /** Style del overlay: máscara con la muesca (combinar con el glow). */
  notchMaskStyle: ComputedRef<Record<string, string>>;
  /** Style del label: margen de desplazamiento según el `rounded`. */
  labelShiftStyle: ComputedRef<{ marginLeft: string } | { marginRight: string } | undefined>;
  /** Desplazamiento actual en px (0 = sin desplazar). */
  labelShift: Ref<number>;
  updateNotch: () => void;
  observeNotch: () => void;
}

// Desplazamiento: 2px por escalón de la escala, desde `rounded-none`.
// Alineada a la escala real de Tailwind v4 + bridge KunUI (`--kun-radius: .25rem`):
// none=0 · sm=1×4px · md=1.5×=6px · lg=2×=8px · xl=3×=12px · 2xl=4×=16px ·
// 3xl=6×=24px · full. `rounded` pelado NO se usa (equivale a 0.25rem = sm).
const ROUNDED_SHIFT_PX = 2;
const ROUNDED_SCALE: string[] = ['rounded-none', 'rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-3xl', 'rounded-full'];
// Radios estándar en px (Tailwind v4, raíz 16px) por índice de `ROUNDED_SCALE`
// (índice 7 = `rounded-full`, se resuelve por medición/pill, no por paso).
const ROUNDED_STEPS_PX = [0, 4, 6, 8, 12, 16, 24];

// Índice de `rounded` en la escala. Clases no listadas (p. ej.
// `rounded-[10px]` o radios por esquina): fallback al radio superior
// izquierdo medido → paso estándar más cercano (un radio que desborda la
// caja se comporta como pill → último escalón).
function roundedStepIndex(roundedClass: string | undefined, overlay: HTMLDivElement | null): number {
  // Compat: `rounded` pelado (0.25rem) == escalón `rounded-sm`.
  const normalized = (roundedClass || '').trim();
  const direct = ROUNDED_SCALE.indexOf(normalized === 'rounded' ? 'rounded-sm' : normalized);
  if (direct >= 0) return direct;
  if (!overlay || typeof getComputedStyle === 'undefined') return 0;
  const first = ((getComputedStyle(overlay).borderTopLeftRadius || '0px').trim().split(/[\s,]+/)[0]) || '0px';
  const n = parseFloat(first);
  if (!Number.isFinite(n)) return 0;
  if (first.endsWith('%')) return ROUNDED_SCALE.length - 1;
  let px = n;
  if (first.endsWith('rem')) {
    px = n * (typeof document !== 'undefined' ? parseFloat(getComputedStyle(document.documentElement).fontSize) || 16 : 16);
  } else if (!first.endsWith('px')) {
    return 0;
  }
  const halfBox = Math.min(overlay.clientWidth, overlay.clientHeight) / 2;
  if (px >= halfBox) return ROUNDED_SCALE.length - 1;
  let best = 0;
  for (let i = 1; i < ROUNDED_STEPS_PX.length; i++) {
    if (Math.abs(px - ROUNDED_STEPS_PX[i]) < Math.abs(px - ROUNDED_STEPS_PX[best])) best = i;
  }
  return best;
}

export function useKunFieldNotch(opts: KunFieldNotchOptions, extraSources: WatchSource[] = []): KunFieldNotchApi {
  const labelRef: Ref<HTMLLabelElement | null> = ref(null);
  const overlayRef: Ref<HTMLDivElement | null> = ref(null);
  // Rectángulo del recorte, en coordenadas del border-box del overlay.
  const notchX = ref(0);
  const notchW = ref(0);
  const notchH = ref(1);
  const labelShift = ref(0);

  function updateNotch(): void {
    const el = labelRef.value;
    const ov = overlayRef.value;
    if (!el || !ov || !opts.hasLabel() || !opts.isFloating()) {
      notchW.value = 0;
      labelShift.value = 0;
      return;
    }
    // Caja real del label. El recorte baja hasta su pie para limpiar también
    // el arco cuando flota dentro de la zona de curva (pill / radios grandes).
    notchX.value = Math.max(el.offsetLeft - 1, 0);
    notchW.value = el.offsetWidth + 2;
    const bottom = el.offsetTop + el.offsetHeight + 2;
    notchH.value = Math.max(1, Math.min(bottom, ov.clientHeight - 2));
    labelShift.value = ROUNDED_SHIFT_PX * roundedStepIndex(opts.roundedClass(), ov);
  }

  const notchMaskStyle = computed(() => {
    const img = 'linear-gradient(#000 0 0), linear-gradient(#000 0 0)';
    const position = `0 0, ${notchX.value}px 0`;
    const size = `100% 100%, ${notchW.value}px ${notchH.value}px`;
    return {
      WebkitMaskImage: img,
      WebkitMaskPosition: position,
      WebkitMaskSize: size,
      WebkitMaskRepeat: 'no-repeat',
      WebkitMaskComposite: 'xor',
      maskImage: img,
      maskPosition: position,
      maskSize: size,
      maskRepeat: 'no-repeat',
      maskComposite: 'exclude',
      transitionProperty: 'mask-position, mask-size, -webkit-mask-position, -webkit-mask-size',
      transitionDuration: '.2s',
      transitionTimingFunction: 'ease'
    } as Record<string, string>;
  });

  // Margen que desplaza el label flotante: a la derecha si está anclado a la
  // izquierda (`left-*`), a la izquierda si está anclado a la derecha (`right-*`).
  const labelShiftStyle = computed(() => {
    if (labelShift.value === 0) return undefined;
    return /(^|\s)right-/.test(opts.labelLeftClass())
      ? { marginRight: `${labelShift.value}px` }
      : { marginLeft: `${labelShift.value}px` };
  });

  let notchRO: ResizeObserver | null = null;
  let notchTransEl: HTMLLabelElement | null = null;
  // La medición vía `nextTick` puede caer a mitad de las transiciones del
  // label (`transition-all`: margen del desplazamiento, tamaño al flotar…).
  // Re-medir al terminar cada transición evita muescas corridas que solo se
  // acomodan con un reflow posterior (zoom/resize).
  function handleNotchTransition(e: TransitionEvent): void {
    if (e.target === notchTransEl) updateNotch();
  }
  function disconnectNotch(): void {
    notchRO?.disconnect();
    notchRO = null;
    if (notchTransEl) {
      notchTransEl.removeEventListener('transitionend', handleNotchTransition);
      notchTransEl = null;
    }
  }
  function observeNotch(): void {
    disconnectNotch();
    if (typeof ResizeObserver !== 'undefined') {
      notchRO = new ResizeObserver(() => updateNotch());
      if (labelRef.value) notchRO.observe(labelRef.value);
      // Cambios de tamaño del field (responsive, zoom): re-medir la muesca.
      if (overlayRef.value) notchRO.observe(overlayRef.value);
    }
    const el = labelRef.value;
    if (el && typeof el.addEventListener !== 'undefined') {
      notchTransEl = el;
      el.addEventListener('transitionend', handleNotchTransition);
    }
  }

  onMounted(() => {
    updateNotch();
    observeNotch();
    installKunNotchDebug(); // TODO-DEBUG-REMOVE
    if (typeof document !== 'undefined' && typeof document.fonts !== 'undefined' && document.fonts.ready) {
      document.fonts.ready.then(() => updateNotch()).catch(() => undefined);
    }
  });
  onBeforeUnmount(() => {
    disconnectNotch();
  });

  watch([
    () => opts.isFloating(),
    () => opts.labelLeftClass(),
    () => opts.hasLabel(),
    () => opts.roundedClass(),
    ...extraSources
  ], () => {
    nextTick(() => {
      observeNotch();
      updateNotch();
    });
  });
  // El margen desplaza la caja del label: re-medir la muesca tras aplicarlo
  // (se estabiliza en dos pasadas; el ResizeObserver solo mira tamaño).
  watch(labelShift, () => {
    nextTick(() => updateNotch());
  });

  return { labelRef, overlayRef, notchMaskStyle, labelShiftStyle, labelShift, updateNotch, observeNotch };
}
