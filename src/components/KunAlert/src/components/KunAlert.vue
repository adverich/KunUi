<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="px-2"
      :class="[wrapperClass, positionClass]"
      :style="zIndexStyle('notification')"
      @click.self="onSelfClick"
      @keydown.esc="handleEscape"
      tabindex="0"
      v-bind="$attrs"
    >
      <div :class="[alertClass, alertColorClass]">
        <div class="flex justify-center py-4" v-if="icon">
          <div class="rounded-full p-4 bg-black/10">
            <KunIcon :icon="icon" :size="iconSize" />
          </div>
        </div>

        <div class="text-center flex flex-col justify-center items-center" :class="paddingContainer">
          <div v-if="title" :class="[titleClass, 'my-2']">{{ title }}</div>
          <div v-if="message" :class="messageClass">{{ message }}</div>

          <div class="flex gap-4 mt-4" v-if="persistent">
            <KunBtn
              v-if="actionLabel"
              @click="$emit('action')"
            >
              {{ actionLabel }}
            </KunBtn>
            <KunBtn
              v-if="!closable"
              @click="onClose"
            >
              {{ persistentLabel }}
            </KunBtn>
          </div>

          <button
            v-if="closable"
            class="absolute top-0 right-1 px-1 text-xl focus:outline-none cursor-pointer"
            @click="onClose"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch, onBeforeUnmount } from 'vue'
import KunIcon from '../../../KunIcon/src/components/KunIcon.vue'
import KunBtn from '../../../KunBtn/src/components/KunBtn.vue'
import { kunAlertProps } from '../composables/kunAlertProps.js'
import { kunVariantClasses } from '../../../../theme/kunVariants.js'
import { zIndexStyle } from '../../../../theme/kunZIndex.js'

const props = defineProps(kunAlertProps)

const emits = defineEmits(['update:modelValue', 'action'])

const alertColorClass = computed(() => kunVariantClasses(props.color, props.variant))

let timer: ReturnType<typeof setTimeout> | null = null

const clearTimer = (): void => {
  if (timer !== null) {
    clearTimeout(timer)
    timer = null
  }
}

const startTimer = (): void => {
  clearTimer()
  if (!props.modelValue || props.persistent || !props.timeout) return
  timer = setTimeout(() => {
    emits('update:modelValue', false)
  }, props.timeout)
}

watch(
  () => [props.modelValue, props.timeout, props.persistent],
  () => startTimer(),
  { immediate: true }
)

onBeforeUnmount(clearTimer)

const positionClass = computed(() => {
  if (props.fullscreen) return `fixed inset-0 flex items-center justify-center ${props.margin}`
  const m = props.margin
  switch (props.position) {
    case 'tl': return `fixed top-0 left-0 ${m}`
    case 'tc': return `fixed top-0 left-1/2 transform -translate-x-1/2 ${m}`
    case 'tr': return `fixed top-0 right-0 ${m}`
    case 'cl': return `fixed top-1/2 left-0 transform -translate-y-1/2 ${m}`
    case 'cc': return `fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${m}`
    case 'cr': return `fixed top-1/2 right-0 transform -translate-y-1/2 ${m}`
    case 'bl': return `fixed bottom-0 left-0 ${m}`
    case 'bc': return `fixed bottom-0 left-1/2 transform -translate-x-1/2 ${m}`
    case 'br': return `fixed bottom-0 right-0 ${m}`
    default: return `fixed top-0 left-1/2 transform -translate-x-1/2 ${m}`
  }
})

const wrapperClass = computed(() => `${props.fullscreen ? 'w-full h-full' : 'w-fit'} ${props.transition}`)

const onClose = () => {
  emits('update:modelValue', false)
}

const onSelfClick = () => {
  if (!props.persistent && !props.fullscreen) onClose()
}

const handleEscape = (e: KeyboardEvent): void => {
  if (!props.persistent && props.fullscreen) onClose()
}
</script>

