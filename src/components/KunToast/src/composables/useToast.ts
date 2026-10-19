import { ref, provide, inject, type Ref, type InjectionKey } from 'vue'
import type { KunBtnSize } from '../../../KunBtn/src/composables/kunBtnProps.js';
import type { KunColor, KunVariant } from '../../../../theme/kunVariants.js';
import type { KunToastColor, KunToastOrientation, KunToastType } from './kunToastProps.js';

export interface ToastAction {
    label?: string;
    text?: string;
    icon?: string | Record<string, unknown> | Function | unknown[] | boolean;
    variant?: KunVariant;
    size?: KunBtnSize;
    color?: KunColor;
    onClick?: (event: MouseEvent) => void;
    closeOnClick?: boolean;
    [key: string]: unknown;
}

export interface ToastConfig {
    id?: string | number;
    toastId?: string | number;
    title?: string;
    description?: string;
    /** URL de imagen para el avatar del toast (tiene prioridad visual sobre `icon`). */
    avatar?: string;
    icon?: string | Record<string, unknown> | Function | unknown[] | boolean | null;
    color?: KunToastColor;
    orientation?: KunToastOrientation;
    duration?: number;
    progress?: boolean;
    progressColor?: string | null;
    closable?: boolean;
    closeIcon?: string | Record<string, unknown> | Function | unknown[] | boolean | null;
    actions?: ToastAction[];
    type?: KunToastType;
    /** Callback al hacer clic sobre el toast completo (cierre y acciones lo detienen). */
    onClick?: (toast: ToastItem) => void;
    ui?: Record<string, unknown>;
    'onUpdate:open'?: ((open: boolean) => void) | null;
    [key: string]: unknown;
}

export interface ToastItem extends ToastConfig {
    id: string | number;
    createdAt: number;
    /** Milisegundos restantes antes del auto-dismiss (fuente Ãºnica de la barra de progreso). */
    remainingTime: number;
    isPaused: boolean;
    isPulsing: boolean;
    onUpdateOpen: ((open: boolean) => void) | null;
}

export interface KunToastOptions {
    /** DuraciÃ³n por defecto en ms para toasts sin `duration` propio (0 = persistente). */
    duration?: number;
    /** MÃ¡ximo de toasts retenidos simultÃ¡neamente. */
    max?: number;
    /** Valor por defecto de `progress` para toasts sin `progress` propio. */
    progress?: boolean;
}

export interface KunToastSystem {
    toasts: Ref<ToastItem[]>;
    add: (config?: ToastConfig) => { id: string | number };
    update: (id: string | number, config?: ToastConfig) => void;
    remove: (id: string | number) => void;
    pause: (id: string | number) => void;
    resume: (id: string | number) => void;
    /** Pausa el auto-dismiss de TODOS los toasts (hover/focus sobre el toaster, patrón Nuxt). */
    pauseAll: () => void;
    /** Reanuda el auto-dismiss de todos los toasts. */
    resumeAll: () => void;
    clear: () => void;
    /** Reconfigura duraciÃ³n/mÃ¡ximo/progress por defecto en caliente. */
    configure: (options: KunToastOptions) => void;
    cleanup: () => void;
}

export const KUN_TOAST_KEY: InjectionKey<KunToastSystem> = Symbol('kunToast')
let toastCounter = 0

/**
 * Crea una instancia del sistema de toasts. Normalmente no la uses directo:
 * `useToast()` devuelve un singleton global compartido por toda la app.
 */
export function createKunToast(options: KunToastOptions = {}): KunToastSystem {
  const toasts: Ref<ToastItem[]> = ref([])
  const pausedToasts = new Set<string | number>()

  let globalDuration = options.duration ?? 5000
  let maxToasts = options.max ?? 5
  let defaultProgress = options.progress ?? true

  // Un unico reloj que descuenta `remainingTime` (pausable por hover). No hay
  // un segundo timer en KunToast: la barra de progreso es derivada.
  const TICK = 50
  let timer: ReturnType<typeof setInterval> | null = null
  let lastTick = 0

  function startTimer(): void {
    if (timer) return
    lastTick = Date.now()
    timer = setInterval(tick, TICK)
  }

  function stopTimer(): void {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function tick(): void {
    const now = Date.now()
    const delta = Math.max(0, now - lastTick)
    lastTick = now

    for (let i = toasts.value.length - 1; i >= 0; i--) {
      const toast = toasts.value[i]
      // duration 0 = persistente; en pausa (hover/focus) no descuenta.
      if (toast.duration === 0 || toast.isPaused) continue

      const remaining = toast.remainingTime - delta
      if (remaining <= 0) {
        remove(toast.id)
      } else {
        toast.remainingTime = remaining
      }
    }

    if (toasts.value.length === 0) stopTimer()
  }

  function add(config: ToastConfig = {}): { id: string | number } {
    const id = config.id ?? config.toastId ?? `toast-${++toastCounter}`
    const duration = (config.duration ?? globalDuration) as number

    // Si ya existe un toast con ese ID, actualizarlo y hacer "pulse".
    const existingIndex = toasts.value.findIndex((t: ToastItem) => t.id === id)
    if (existingIndex !== -1) {
      const existing = toasts.value[existingIndex]
      toasts.value[existingIndex] = {
        ...existing,
        ...config,
        id,
        duration,
        createdAt: Date.now(),
        remainingTime: duration === 0 ? 0 : duration,
        isPaused: false,
        isPulsing: true
      }
      setTimeout(() => {
        const idx = toasts.value.findIndex((t: ToastItem) => t.id === id)
        if (idx !== -1) toasts.value[idx].isPulsing = false
      }, 300)
      if (duration !== 0) startTimer()
      return { id }
    }

    // Si se excede el mÃ¡ximo, remover el mÃ¡s antiguo.
    if (toasts.value.length >= maxToasts) {
      toasts.value.splice(0, toasts.value.length - maxToasts + 1)
    }

    toasts.value.push({
      id,
      title: config.title || '',
      description: config.description || '',
      avatar: config.avatar || '',
      icon: config.icon || null,
      color: config.color || 'primary',
      orientation: config.orientation || 'vertical',
      duration,
      progress: config.progress !== undefined ? config.progress : defaultProgress,
      progressColor: config.progressColor || null,
      closable: config.closable !== undefined ? config.closable : true,
      closeIcon: config.closeIcon || null,
      actions: config.actions || [],
      type: config.type || 'foreground',
      onClick: config.onClick,
      ui: (config.ui as Record<string, unknown>) || {},
      createdAt: Date.now(),
      remainingTime: duration === 0 ? 0 : duration,
      isPaused: false,
      isPulsing: false,
      onUpdateOpen: (config['onUpdate:open'] as ((open: boolean) => void) | undefined) || null
    })

    if (duration !== 0) startTimer()
    return { id }
  }

  function update(id: string | number, config: ToastConfig = {}): void {
    const index = toasts.value.findIndex((t: ToastItem) => t.id === id)
    if (index === -1) return

    const existing = toasts.value[index]
    const duration = (config.duration ?? existing.duration) as number
    const hasNewDuration = config.duration !== undefined

    toasts.value[index] = {
      ...existing,
      ...config,
      id,
      duration,
      remainingTime: hasNewDuration
        ? (duration === 0 ? 0 : duration)
        : existing.remainingTime,
      createdAt: hasNewDuration ? Date.now() : existing.createdAt,
      isPaused: false,
      isPulsing: false
    }

    if (duration !== 0) startTimer()
  }

  function remove(id: string | number): void {
    const index = toasts.value.findIndex((t: ToastItem) => t.id === id)
    if (index === -1) return

    const toast = toasts.value[index]
    if (toast.onUpdateOpen) {
      toast.onUpdateOpen(false)
    }

    toasts.value.splice(index, 1)
    pausedToasts.delete(id)
  }

  function pause(id: string | number): void {
    pausedToasts.add(id)
    const index = toasts.value.findIndex((t: ToastItem) => t.id === id)
    if (index !== -1) {
      toasts.value[index].isPaused = true
    }
  }

  function resume(id: string | number): void {
    pausedToasts.delete(id)
    const index = toasts.value.findIndex((t: ToastItem) => t.id === id)
    if (index !== -1) {
      toasts.value[index].isPaused = false
    }
  }

  // Pausa/reanudación global: al pasar el mouse (o enfocar) el toaster se
  // congelan TODOS los temporizadores para poder leer cada mensaje (Nuxt/Reka).
  function pauseAll(): void {
    for (const toast of toasts.value) {
      toast.isPaused = true
      pausedToasts.add(toast.id)
    }
  }

  function resumeAll(): void {
    for (const toast of toasts.value) {
      toast.isPaused = false
    }
    pausedToasts.clear()
  }

  function clear(): void {
    toasts.value.forEach((toast: ToastItem) => {
      if (toast.onUpdateOpen) {
        toast.onUpdateOpen(false)
      }
    })
    toasts.value = []
    pausedToasts.clear()
    stopTimer()
  }

  function configure(opts: KunToastOptions): void {
    if (opts.duration !== undefined) globalDuration = opts.duration
    if (opts.max !== undefined) maxToasts = opts.max
    if (opts.progress !== undefined) defaultProgress = opts.progress

    if (toasts.value.length > maxToasts) {
      toasts.value.splice(0, toasts.value.length - maxToasts)
    }
  }

  return {
    toasts,
    add,
    update,
    remove,
    pause,
    resume,
    pauseAll,
    resumeAll,
    clear,
    configure,
    cleanup: stopTimer
  }
}

// ---------------------------------------------------------------------------
// Sistema global (patrÃ³n Nuxt UI): `useToast()` funciona en cualquier parte de
// la app sin depender de que `<KunToaster>` sea ancestro. Fuente compartida.
// ---------------------------------------------------------------------------
let globalToastSystem: KunToastSystem | null = null

/** Devuelve (creÃ¡ndolo la primera vez) el sistema de toasts global. */
export function getKunToast(options?: KunToastOptions): KunToastSystem {
  if (!globalToastSystem) {
    globalToastSystem = createKunToast(options)
  }
  return globalToastSystem
}

/** Proporciona un sistema de toasts scoped vÃ­a provide/inject (uso avanzado). */
export function provideKunToast(toastSystem: KunToastSystem): void {
  provide(KUN_TOAST_KEY, toastSystem)
}

/**
 * Acceso al sistema de toasts. Devuelve el sistema scoped si existe un
 * `provideKunToast` ancestro; en caso contrario, el singleton global.
 */
export function useToast(): KunToastSystem {
  const injected = inject(KUN_TOAST_KEY, null)
  return injected ?? getKunToast()
}

