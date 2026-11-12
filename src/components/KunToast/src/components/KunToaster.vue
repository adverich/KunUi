<template>
  <Teleport :to="teleportTo" :disabled="teleportDisabled">
    <div
      ref="containerRef"
      :class="[containerClass, positionClass]"
      :style="toastZIndex"
      class="fixed pointer-events-none flex flex-col gap-3 p-4 max-h-screen overflow-hidden"
      role="region"
      aria-label="Notificaciones"
    >
      <TransitionGroup
        :name="transitionName"
        tag="div"
        class="flex flex-col gap-3 pointer-events-auto"
        @mouseenter="onEnter"
        @mouseleave="onLeave"
        @focusin="onFocusIn"
        @focusout="onFocusOut"
      >
        <div
          v-for="toast in displayedToasts"
          :key="toast.id"
          :class="['transition-all', toast.onClick ? 'cursor-pointer' : '']"
          :data-expanded="expanded"
          @click="onToastClick(toast)"
        >
          <KunToast
            :toast-id="toast.id"
            :title="toast.title"
            :description="toast.description"
            :avatar="toast.avatar || ''"
            :icon="toast.icon"
            :color="toast.color"
            :orientation="toast.orientation"
            :duration="toast.duration"
            :progress="toast.progress !== false"
            :progress-color="toast.progressColor"
            :closable="toast.closable"
            :close-icon="toast.closeIcon"
            :actions="toast.actions"
            :type="toast.type"
            :is-paused="toast.isPaused"
            :is-pulsing="toast.isPulsing"
            :remaining-time="toast.remainingTime"
            :ui="(toast.ui as Record<string, string>)"
            @close="onToastClose(toast.id)"
          >
            <template v-if="$slots.leading" #leading="slotProps">
              <slot name="leading" v-bind="slotProps" :toast="toast" />
            </template>
            <template v-if="$slots.title" #title="slotProps">
              <slot name="title" v-bind="slotProps" :toast="toast" />
            </template>
            <template v-if="$slots.description" #description="slotProps">
              <slot name="description" v-bind="slotProps" :toast="toast" />
            </template>
            <template v-if="$slots.actions" #actions="slotProps">
              <slot name="actions" v-bind="slotProps" :toast="toast" />
            </template>
            <template v-if="$slots.close" #close="slotProps">
              <slot name="close" v-bind="slotProps" :toast="toast" />
            </template>
          </KunToast>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { kunToasterProps } from '../composables/kunToasterProps.js'
import { zIndexStyle } from '../../../../theme/kunZIndex.js'
import { useToast, type ToastItem } from '../composables/useToast.js'
import KunToast from './KunToast.vue'

const props = defineProps(kunToasterProps)

const toastZIndex = zIndexStyle('notification')

// Sistema global compartido (patrón Nuxt): `useToast()` en cualquier parte de
// la app agrega a esta fuente. Si hay un `provideKunToast` ancestro, se usa ese.
const toastSystem = useToast()

// Reconfigura el sistema en caliente cuando cambian las props globales.
watch(
  () => [props.duration, props.max, props.progress] as const,
  ([duration, max, progress]) => {
    toastSystem.configure({ duration, max, progress })
  },
  { immediate: true }
)

// Colapsado: solo el más nuevo; hover/focus (o `expand`) los muestra todos.
// Hover y focus se trackean por separado: cerrar un toast con la cruz dispara
// un `focusout` (el botón se elimina del DOM) que NO debe reanudar mientras el
// puntero siga sobre el toaster.
const hovered = ref(false)
const focused = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const interacting = computed(() => hovered.value || focused.value)
const expanded = computed(() => props.expand || interacting.value)

watch(interacting, (active) => {
  if (active) {
    toastSystem.pauseAll()
  } else {
    toastSystem.resumeAll()
  }
})

const visibleToasts = computed(() => toastSystem.toasts.value.slice(-props.max))
const displayedToasts = computed(() =>
  expanded.value ? visibleToasts.value : visibleToasts.value.slice(-1)
)

// Portal destino
const teleportTo = computed(() => {
  const p = props.portal
  if (typeof p === 'string') return p
  if (p && typeof p === 'object') return p as unknown as string
  return 'body'
})
const teleportDisabled = computed(() => props.portal === false)

// Clase de posición
const positionClass = computed(() => {
  const positionMap: Record<string, string> = {
    'top-left': 'top-0 left-0 items-start',
    'top-center': 'top-0 left-1/2 -translate-x-1/2 items-start',
    'top-right': 'top-0 right-0 items-start',
    'bottom-left': 'bottom-0 left-0 items-end',
    'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2 items-end',
    'bottom-right': 'bottom-0 right-0 items-end'
  }
  return positionMap[props.position as string] || positionMap['bottom-right']
})

// Transición
const transitionName = computed(() => {
  const isTop = props.position.includes('top')
  return isTop ? 'toast-slide-down' : 'toast-slide-up'
})

// Handlers
const onToastClose = (id: string | number): void => {
  toastSystem.remove(id)
}

// Hover/focus sobre el toaster: congela los temporizadores de TODOS los toasts
// (para poder leerlos) y expande el apilado colapsado.
const onEnter = (): void => {
  hovered.value = true
}

// `mouseleave` puede dispararse al eliminar el toast que está bajo el puntero
// (aunque el mouse no se haya movido). Re-verificamos en el siguiente frame si
// el puntero sigue dentro del toaster antes de marcarlo como "fuera".
const onLeave = (e: MouseEvent): void => {
  const x = e.clientX
  const y = e.clientY
  requestAnimationFrame(() => {
    const el = containerRef.value
    if (!el) {
      hovered.value = false
      return
    }
    const under = document.elementFromPoint(x, y)
    if (!under || !el.contains(under)) {
      hovered.value = false
    }
  })
}

const onFocusIn = (): void => {
  focused.value = true
}

const onFocusOut = (): void => {
  focused.value = false
}

const onToastClick = (toast: ToastItem): void => {
  toast.onClick?.(toast)
}

// Cleanup
onBeforeUnmount(() => {
  toastSystem.cleanup()
})

// Exponer métodos para uso externo
defineExpose({
  add: toastSystem.add,
  update: toastSystem.update,
  remove: toastSystem.remove,
  clear: toastSystem.clear,
  toasts: toastSystem.toasts
})
</script>

<style scoped>
/* Slide up animation (bottom positions) */
.toast-slide-up-enter-active {
  transition: all 0.3s ease-out;
}
.toast-slide-up-leave-active {
  transition: all 0.2s ease-in;
}
.toast-slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
.toast-slide-up-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
  max-height: 0;
  margin: 0;
  padding: 0;
}
.toast-slide-up-move {
  transition: transform 0.3s ease;
}

/* Slide down animation (top positions) */
.toast-slide-down-enter-active {
  transition: all 0.3s ease-out;
}
.toast-slide-down-leave-active {
  transition: all 0.2s ease-in;
}
.toast-slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}
.toast-slide-down-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
  max-height: 0;
  margin: 0;
  padding: 0;
}
.toast-slide-down-move {
  transition: transform 0.3s ease;
}
</style>
