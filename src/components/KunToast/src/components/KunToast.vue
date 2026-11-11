<template>
  <div
    :class="[uiClasses.root, colorClasses.root, orientationClass, pulseClass]"
    :data-toast-id="toastId"
    role="alert"
    :aria-live="type === 'foreground' ? 'assertive' : 'polite'"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @focusin="onMouseEnter"
    @focusout="onMouseLeave"
  >
    <div :class="[uiClasses.wrapper, wrapperClasses]">
      <!-- Leading slot (icon/avatar) -->
      <div :class="[uiClasses.icon, iconContainerClass]">
        <slot name="leading" :ui="ui">
          <KunAvatar
            v-if="avatar"
            :image="avatar"
            :size="20"
            rounded
            :class="colorClasses.icon"
          />
          <KunIcon
            v-else-if="resolvedIcon"
            :icon="resolvedIcon"
            :class="[iconClass, colorClasses.icon]"
          />
        </slot>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <!-- Title -->
        <div
          v-if="hasTitle"
          :class="[uiClasses.title, titleClass]"
        >
          <slot name="title">
            <component v-if="isVNode(title)" :is="title" />
            <span v-else>{{ title }}</span>
          </slot>
        </div>

        <!-- Description -->
        <div
          v-if="hasDescription"
          :class="[uiClasses.description, descriptionClass]"
        >
          <slot name="description">
            <component v-if="isVNode(description)" :is="description" />
            <span v-else>{{ description }}</span>
          </slot>
        </div>

        <!-- Actions (vertical orientation) -->
        <div
          v-if="hasActions && orientation === 'vertical'"
          :class="[uiClasses.actions, actionsClass]"
        >
          <slot name="actions">
            <KunBtn
              v-for="(action, idx) in actions"
              :key="idx"
              :text="action.label || action.text"
              :icon="action.icon"
              :variant="action.variant || 'ghost'"
              :size="action.size || 'xs'"
              :color="action.color"
              @click.stop="onActionClick(action, $event)"
            />
          </slot>
        </div>
      </div>

      <!-- Actions (horizontal orientation) + Close button -->
      <div :class="rightActionsClass">
        <div
          v-if="hasActions && orientation === 'horizontal'"
          :class="[uiClasses.actions, actionsClass]"
        >
          <slot name="actions">
            <KunBtn
              v-for="(action, idx) in actions"
              :key="idx"
              :text="action.label || action.text"
              :icon="action.icon"
              :variant="action.variant || 'ghost'"
              :size="action.size || 'xs'"
              :color="action.color"
              @click.stop="onActionClick(action, $event)"
            />
          </slot>
        </div>

        <!-- Close button -->
        <button
          v-if="closable"
          :class="[uiClasses.close, closeButtonClass]"
          @click.stop="onClose"
          aria-label="Cerrar notificación"
        >
          <slot name="close" :ui="ui">
            <KunIcon :icon="resolvedCloseIcon" :class="closeIconClass" />
          </slot>
        </button>
      </div>
    </div>

    <!-- Progress bar -->
    <div
      v-if="progress"
      :class="[uiClasses.progress, progressContainerClass]"
      aria-hidden="true"
    >
      <div
        :class="[progressBarClass, progressColorClass]"
        :style="{ width: `${progressWidth}%` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { kunToastProps } from '../composables/kunToastProps.js'
import type { ToastAction } from '../composables/useToast.js'
import KunBtn from '../../../KunBtn/src/components/KunBtn.vue'
import KunIcon from '../../../KunIcon/src/components/KunIcon.vue'
import KunAvatar from '../../../KunAvatar/src/components/KunAvatar.vue'

const props = defineProps(kunToastProps)
const emit = defineEmits(['close', 'pause', 'resume'])

// Iconos por defecto según color
const defaultIcons: Record<string, unknown> = {
  success: '$check',
  error: '$close',
  warning: '$asterisk',
  info: '$asterisk',
  primary: '$asterisk',
  neutral: null
}

const resolvedIcon = computed(() => {
  if (props.icon) return props.icon
  return defaultIcons[props.color as string] || null
})

const resolvedCloseIcon = computed(() => {
  if (props.closeIcon) return props.closeIcon
  return '$close'
})

// Helpers
const isVNode = (val: unknown): boolean => {
  return !!val && typeof val === 'object' && (val as Record<string, unknown>).type !== undefined
}

const hasTitle = computed(() => !!props.title)
const hasDescription = computed(() => !!props.description)
const hasActions = computed(() => props.actions && props.actions.length > 0)

// Clases
const uiClasses = computed(() => ({
  root: props.ui?.root || '',
  wrapper: props.ui?.wrapper || '',
  title: props.ui?.title || '',
  description: props.ui?.description || '',
  icon: props.ui?.icon || '',
  actions: props.ui?.actions || '',
  progress: props.ui?.progress || '',
  close: props.ui?.close || ''
}))

const colorClasses = computed(() => {
  const colorMap: Record<string, { root: string; icon: string }> = {
    primary: {
      root: 'border-s-4 border-primary',
      icon: 'text-primary'
    },
    success: {
      root: 'border-s-4 border-success',
      icon: 'text-success'
    },
    error: {
      root: 'border-s-4 border-error',
      icon: 'text-error'
    },
    warning: {
      root: 'border-s-4 border-warning',
      icon: 'text-warning'
    },
    info: {
      root: 'border-s-4 border-primary',
      icon: 'text-primary'
    },
    neutral: {
      root: 'border-s-4 border-muted',
      icon: 'text-muted'
    }
  }
  return colorMap[props.color as string] || colorMap.primary
})

const orientationClass = computed(() => {
  return props.orientation === 'horizontal' ? 'items-center' : 'items-start'
})

const pulseClass = computed(() => {
  return props.isPulsing ? 'animate-pulse' : ''
})

const wrapperClasses = 'flex gap-3 p-4'
const iconContainerClass = 'flex-shrink-0'
const iconClass = 'w-5 h-5'

const titleClass = 'text-sm font-semibold text-default'
const descriptionClass = 'text-sm text-muted mt-1'

const actionsClass = 'flex gap-2 mt-2'
const rightActionsClass = computed(() => {
  return props.orientation === 'horizontal' 
    ? 'flex items-center gap-2 flex-shrink-0' 
    : 'flex items-start gap-2 flex-shrink-0'
})

const closeButtonClass = 'p-1 rounded-md hover:bg-accented transition-colors cursor-pointer text-muted'
const closeIconClass = 'w-4 h-4'

// Progress bar
const progressContainerClass = 'h-1 w-full bg-muted rounded-b-[inherit]'
const progressBarClass = 'h-full rounded-b-[inherit] transition-all duration-100 ease-linear'
const progressColorClass = computed(() => {
  if (props.progressColor) return props.progressColor
  const colorMap: Record<string, string> = {
    primary: 'bg-primary',
    success: 'bg-success',
    error: 'bg-error',
    warning: 'bg-warning',
    info: 'bg-primary',
    neutral: 'bg-accented'
  }
  return colorMap[props.color as string] || colorMap.primary
})

// Barra de progreso derivada de `remainingTime` (única fuente: el reloj del
// sistema de toasts). Sin intervalos propios → pausa/reanudación exactas.
const progressWidth = computed(() => {
  const duration = props.duration as number
  if (!props.progress || !duration || duration <= 0) return 100
  if (!props.remainingTime) return 100
  return Math.max(0, Math.min(100, (props.remainingTime / duration) * 100))
})

// Pausa/Resume
const onMouseEnter = () => {
  emit('pause')
}

const onMouseLeave = () => {
  emit('resume')
}

// Acciones
const onActionClick = (action: ToastAction, event: MouseEvent): void => {
  if (action.onClick) {
    action.onClick(event)
  }
  if (action.closeOnClick !== false) {
    onClose()
  }
}

// Cerrar
const onClose = () => {
  emit('close')
}
</script>

<style scoped>
/* Animación de entrada/salida se maneja desde KunToaster con TransitionGroup */
</style>

