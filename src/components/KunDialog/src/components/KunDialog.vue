<template>
  <component :is="teleport ? Teleport : 'div'" :to="teleport ? 'body' : undefined">
    <transition name="fade" appear>
      <div
        v-if="modelValue"
        :class="mergedDialogClass"
        v-bind="$attrs"
      >
        <KunDialogOverlay
          v-if="overlay"
          :persistent="persistent"
          @click="handleOverlayClick"
        />

        <transition
          name="scale"
          enter-active-class="transition transform ease-out duration-300"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition transform ease-in duration-200"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <KunDialogContent
            :fullscreen="fullscreen"
            :scrollable="scrollable"
            :min-width="minWidth"
            :width="width"
            :max-width="maxWidth"
            :height="height"
            :max-height="maxHeigh"
            :bg-color="bgColor"
            :content-class="contentClass"
            @close="close"
          >
            <slot />
          </KunDialogContent>
        </transition>
      </div>
    </transition>
  </component>
</template>

<script setup lang="ts">
import { watch, onMounted, onUnmounted, onBeforeUnmount } from 'vue'
import KunDialogOverlay from './KunDialogOverlay.vue'
import KunDialogContent from './KunDialogContent.vue'

const props = defineProps({
  modelValue: Boolean,
  teleport: { type: Boolean, default: true },
  overlay: { type: Boolean, default: true },
  fullscreen: { type: Boolean, default: false },
  scrollable: { type: Boolean, default: false },
  persistent: { type: Boolean, default: false },
  dialogClass: { type: String, default: '' },
  xPosition: {
    type: String,
    default: 'center', // 'start' | 'center' | 'end'
    validator: v => ['start', 'center', 'end'].includes(v),
  },
  yPosition: {
    type: String,
    default: 'center', // 'start' | 'center' | 'end'
    validator: v => ['top', 'center', 'bottom'].includes(v),
  },
  contentClass: { type: String, default: '' },
  bgColor: { type: String, default: 'bg-slate-100 dark:bg-slate-900' },
  height: { type: String, default: 'h-fit' },
  maxHeigh: { type: String, default: 'max-h-[100vh]' },
  minWidth: { type: String, default: 'min-w-1/3' },
  width: { type: String, default: 'w-full' },
  maxWidth: { type: String, default: 'max-w-1/3' },
})

const emits = defineEmits(['update:modelValue']);
const baseDialogClass = "fixed inset-0 z-250 flex";
const xPositionClass = 'justify-' + props.xPosition;
const yPositionClass = 'items-' + props.yPosition;
const ySpacing = props.yPosition === 'top' ? 'pt-15' : props.yPosition === 'bottom' ? 'pb-15' : '';
const mergedDialogClass = [baseDialogClass, props.dialogClass, xPositionClass, yPositionClass, ySpacing];

const close = () => {
  if (!props.persistent) emits('update:modelValue', false)
}

const handleOverlayClick = () => {
  close()
}

const preventScroll = () => {
  document.body.style.overflow = 'hidden'
}
const restoreScroll = () => {
  document.body.style.overflow = ''
}

watch(() => props.modelValue, (val) => {
  if (val && !props.fullscreen) preventScroll()
  else restoreScroll()
})

onMounted(() => {
  if (props.modelValue && !props.fullscreen) preventScroll();
})

onBeforeUnmount(() => {
  restoreScroll()
})


// Manejador de eventos de teclado
function handleKeydown(event) {
  event.stopPropagation();
  if (event.key === "Escape") {
    if (!props.persistent) {
      emits('update:modelValue', false)
    }
  }
}

// Agregar listener cuando el componente se monta
onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

// Eliminar listener cuando el componente se desmonta
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>
