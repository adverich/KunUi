import { ref, provide, inject, onUnmounted } from 'vue'

const TOAST_KEY = Symbol('kunToast')
let toastCounter = 0

/**
 * Crea una instancia del sistema de toasts para ser proporcionada a la app
 */
export function createKunToast(options = {}) {
  const toasts = ref([])
  const pausedToasts = new Set()

  const globalDuration = options.duration ?? 5000
  const maxToasts = options.max ?? 5

  function add(config = {}) {
    const id = config.id || `toast-${++toastCounter}`
    
    // Si ya existe un toast con ese ID, hacer pulse en lugar de duplicar
    const existingIndex = toasts.value.findIndex(t => t.id === id)
    if (existingIndex !== -1) {
      // Actualizar el existente y hacer "pulse"
      const existing = toasts.value[existingIndex]
      toasts.value[existingIndex] = {
        ...existing,
        ...config,
        id,
        createdAt: Date.now(),
        remainingTime: config.duration || existing.duration || globalDuration,
        isPulsing: true
      }
      setTimeout(() => {
        const idx = toasts.value.findIndex(t => t.id === id)
        if (idx !== -1) {
          toasts.value[idx] = { ...toasts.value[idx], isPulsing: false }
        }
      }, 300)
      return { id }
    }

    // Si se excede el máximo, remover el más antiguo
    if (toasts.value.length >= maxToasts) {
      toasts.value.shift()
    }

    const duration = config.duration ?? globalDuration
    
    toasts.value.push({
      id,
      title: config.title || '',
      description: config.description || '',
      icon: config.icon || null,
      color: config.color || 'primary',
      orientation: config.orientation || 'vertical',
      duration,
      progress: config.progress !== undefined ? config.progress : true,
      progressColor: config.progressColor || null,
      closable: config.closable !== undefined ? config.closable : true,
      closeIcon: config.closeIcon || null,
      actions: config.actions || [],
      type: config.type || 'foreground',
      ui: config.ui || {},
      createdAt: Date.now(),
      remainingTime: duration,
      isPaused: false,
      isPulsing: false,
      onUpdateOpen: config['onUpdate:open'] || null
    })

    return { id }
  }

  function update(id, config = {}) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index === -1) return

    const existing = toasts.value[index]
    toasts.value[index] = {
      ...existing,
      ...config,
      id,
      // Mantener el tiempo restante si no se especifica nueva duración
      remainingTime: config.duration !== undefined 
        ? config.duration 
        : existing.remainingTime,
      createdAt: config.duration !== undefined ? Date.now() : existing.createdAt,
      isPaused: false,
      isPulsing: false
    }
  }

  function remove(id) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index === -1) return

    const toast = toasts.value[index]
    // Notificar cierre si hay callback
    if (toast.onUpdateOpen) {
      toast.onUpdateOpen(false)
    }
    
    toasts.value.splice(index, 1)
    pausedToasts.delete(id)
  }

  function pause(id) {
    pausedToasts.add(id)
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value[index].isPaused = true
    }
  }

  function resume(id) {
    pausedToasts.delete(id)
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value[index].isPaused = false
    }
  }

  function clear() {
    toasts.value.forEach(toast => {
      if (toast.onUpdateOpen) {
        toast.onUpdateOpen(false)
      }
    })
    toasts.value = []
    pausedToasts.clear()
  }

  // Timer global que actualiza los toasts cada 50ms
  const timer = setInterval(() => {
    const now = Date.now()
    for (let i = toasts.value.length - 1; i >= 0; i--) {
      const toast = toasts.value[i]
      
      // Saltar toasts sin duración o pausados
      if (toast.duration === 0 || toast.isPaused) continue

      const elapsed = now - toast.createdAt
      if (elapsed >= toast.remainingTime) {
        remove(toast.id)
      }
    }
  }, 50)

  return {
    toasts,
    add,
    update,
    remove,
    pause,
    resume,
    clear,
    cleanup: () => clearInterval(timer)
  }
}

/**
 * Proporciona el sistema de toasts a través de provide/inject
 */
export function provideKunToast(toastSystem) {
  provide(TOAST_KEY, toastSystem)
}

/**
 * Composable para usar en cualquier componente
 */
export function useToast() {
  const toastSystem = inject(TOAST_KEY, null)
  
  if (!toastSystem) {
    console.warn('[KunToast] useToast() llamado fuera de un contexto con KunToaster. Asegúrate de montar <KunToaster /> en tu app.')
    // Retornar un mock que no hace nada para evitar errores
    return {
      toasts: ref([]),
      add: () => ({ id: null }),
      update: () => {},
      remove: () => {},
      pause: () => {},
      resume: () => {},
      clear: () => {}
    }
  }

  return toastSystem
}
