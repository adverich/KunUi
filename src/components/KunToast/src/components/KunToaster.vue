<template>
  <Teleport to="body">
    <div
      :class="[containerClass, positionClass]"
      :style="{ zIndex }"
      class="fixed pointer-events-none flex flex-col gap-3 p-4 max-h-screen overflow-hidden"
    >
      <TransitionGroup
        :name="transitionName"
        tag="div"
        class="flex flex-col gap-3 pointer-events-auto"
      >
        <div
          v-for="toast in displayedToasts"
          :key="toast.id"
          class="transition-all"
        >
          <KunToast
            v-bind="toast"
            @close="onToastClose(toast.id)"
            @pause="onToastPause(toast.id)"
            @resume="onToastResume(toast.id)"
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

<script setup>
import { computed, onBeforeUnmount, watch } from 'vue'
import { kunToasterProps } from '../composables/kunToasterProps'
import { useToast, provideKunToast, createKunToast } from '../composables/useToast'
import KunToast from './KunToast.vue'

const props = defineProps(kunToasterProps)
const emit = defineEmits(['update:max'])

// Crear el sistema de toasts localmente
const toastSystem = createKunToast({
  duration: props.duration,
  max: props.max
})

// Exponer vía provide/inject
provideKunToast(toastSystem)

// Toasts a mostrar (respetando el máximo)
const displayedToasts = computed(() => {
  return toastSystem.toasts.value.slice(-props.max)
})

// Clase de posición
const positionClass = computed(() => {
  const positionMap = {
    'top-left': 'top-0 left-0 items-start',
    'top-center': 'top-0 left-1/2 -translate-x-1/2 items-start',
    'top-right': 'top-0 right-0 items-start',
    'bottom-left': 'bottom-0 left-0 items-end',
    'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2 items-end',
    'bottom-right': 'bottom-0 right-0 items-end'
  }
  return positionMap[props.position] || positionMap['bottom-right']
})

// Transición
const transitionName = computed(() => {
  const isTop = props.position.includes('top')
  if (isTop) {
    return 'toast-slide-down'
  }
  return 'toast-slide-up'
})

// Handlers
const onToastClose = (id) => {
  toastSystem.remove(id)
}

const onToastPause = (id) => {
  toastSystem.pause(id)
}

const onToastResume = (id) => {
  toastSystem.resume(id)
}

// Watch max prop
watch(() => props.max, (newVal) => {
  // El límite se maneja en el createKunToast, pero podemos emitir
  emit('update:max', newVal)
})

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
