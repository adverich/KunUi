<template>
  <div
    :class="[uiClasses.root, colorClasses.root, orientationClass, pulseClass]"
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
          <component
            v-if="resolvedIcon"
            :is="resolvedIcon"
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
              :variant="action.variant || 'text'"
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
              :variant="action.variant || 'text'"
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
            <component :is="resolvedCloseIcon" :class="closeIconClass" />
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

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { kunToastProps } from '../composables/kunToastProps'
import KunBtn from '../../../KunBtn/src/components/KunBtn.vue'
import IconClose from '../../../../icons/IconClose.vue'
import IconCheck from '../../../../icons/IconCheck.vue'
import IconAsterisk from '../../../../icons/IconAsterisk.vue'

const props = defineProps(kunToastProps)
const emit = defineEmits(['close', 'pause', 'resume'])

// Iconos por defecto según color
const defaultIcons = {
  success: IconCheck,
  error: IconClose,
  warning: IconAsterisk,
  info: IconAsterisk,
  primary: IconAsterisk,
  neutral: null
}

const resolvedIcon = computed(() => {
  if (props.icon) return props.icon
  return defaultIcons[props.color] || null
})

const resolvedCloseIcon = computed(() => {
  if (props.closeIcon) return props.closeIcon
  return IconClose
})

// Helpers
const isVNode = (val) => {
  return val && typeof val === 'object' && val.type !== undefined
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
  const colorMap = {
    primary: {
      root: 'border-l-4 border-primary',
      icon: 'text-primary'
    },
    success: {
      root: 'border-l-4 border-success',
      icon: 'text-success'
    },
    error: {
      root: 'border-l-4 border-error',
      icon: 'text-error'
    },
    warning: {
      root: 'border-l-4 border-warning',
      icon: 'text-warning'
    },
    info: {
      root: 'border-l-4 border-primary',
      icon: 'text-primary'
    },
    neutral: {
      root: 'border-l-4 border-surface',
      icon: 'text-slate-500 dark:text-slate-400'
    }
  }
  return colorMap[props.color] || colorMap.primary
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

const titleClass = 'text-sm font-semibold text-slate-900 dark:text-slate-100'
const descriptionClass = 'text-sm text-slate-600 dark:text-slate-400 mt-1'

const actionsClass = 'flex gap-2 mt-2'
const rightActionsClass = computed(() => {
  return props.orientation === 'horizontal' 
    ? 'flex items-center gap-2 flex-shrink-0' 
    : 'flex items-start gap-2 flex-shrink-0'
})

const closeButtonClass = 'p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer text-slate-500 dark:text-slate-400'
const closeIconClass = 'w-4 h-4'

// Progress bar
const progressContainerClass = 'h-1 w-full bg-slate-200 dark:bg-slate-700 rounded-b'
const progressBarClass = 'h-full rounded-b transition-all duration-100 ease-linear'
const progressColorClass = computed(() => {
  if (props.progressColor) return props.progressColor
  const colorMap = {
    primary: 'bg-primary',
    success: 'bg-success',
    error: 'bg-error',
    warning: 'bg-warning',
    info: 'bg-primary',
    neutral: 'bg-slate-500'
  }
  return colorMap[props.color] || colorMap.primary
})

// Animación de progreso
let progressInterval = null
const progressWidth = ref(100)

onMounted(() => {
  if (props.duration > 0 && props.progress) {
    const step = 50
    const decrement = (step / props.duration) * 100
    progressWidth.value = 100
    
    progressInterval = setInterval(() => {
      if (!props.isPaused) {
        progressWidth.value -= decrement
        if (progressWidth.value <= 0) {
          progressWidth.value = 0
          clearInterval(progressInterval)
        }
      }
    }, step)
  }
})

onBeforeUnmount(() => {
  if (progressInterval) {
    clearInterval(progressInterval)
  }
})

// Pausa/Resume
const onMouseEnter = () => {
  emit('pause')
}

const onMouseLeave = () => {
  emit('resume')
}

// Acciones
const onActionClick = (action, event) => {
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
