<template>
  <div
    v-if="modelValue"
    :class="[wrapperClass, positionClass]"
    :style="{ zIndex }"
    @click.self="onSelfClick"
    @keydown.esc="handleEscape"
    tabindex="0"
    v-bind="$attrs"
  >
    <div :class="[alertClass, textColor, bgColor, borderColor]">
      <div class="flex justify-center py-4" v-if="icon">
        <div class="rounded-full p-4" :class="iconBgColor">
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
          class="absolute top-0 right-1 text-xl focus:outline-none cursor-pointer"
          @click="onClose"
        >
          <KunIcon icon="hand" size="text-base" class="mr-1" />
          &times;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import KunIcon from '../../../KunIcon/src/components/KunIcon.vue'
import KunBtn from '../../../KunBtn/src/components/KunBtn.vue'

const props = defineProps({
  modelValue: Boolean,
  title: String,
  message: String,
  position: {
    type: String,
    default: 'br',
    validator: v => [
      'tl', 'tc', 'tr',
      'cl', 'cc', 'cr',
      'bl', 'bc', 'br'
    ].includes(v)
  },
  icon: {
    type: String,
    default: null
  },
  iconSize: {
    type: String,
    default: 'text-2xl'
  },
  iconBgColor: {
    type: String,
    default: 'bg-red-200'
  },
  bgColor: {
    type: String,
    default: 'bg-red-500'
  },
  textColor: {
    type: String,
    default: 'text-white'
  },
  borderColor: {
    type: String,
    default: ''
  },
  titleClass: {
    type: String,
    default: 'text-2xl font-bold'
  },
  messageClass: {
    type: String,
    default: 'text-base font-normal'
  },
  closable: {
    type: Boolean,
    default: false
  },
  zIndex: {
    type: [String, Number],
    default: 2500
  },
  transition: {
    type: String,
    default: 'transition-opacity duration-300 ease-in-out'
  },
  alertClass: {
    type: String,
    default: 'relative w-fit rounded-lg shadow-md'
  },
  paddingContainer: {
    type: String,
    default: 'p-2'
  },
  margin: {
    type: String,
    default: 'm-2'
  },
  fullscreen: {
    type: Boolean,
    default: false
  },
  persistent: {
    type: Boolean,
    default: false
  },
  persistentLabel: {
    type: String,
    default: 'Aceptar'
  },
  actionLabel: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['update:modelValue', 'action'])

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

const handleEscape = (e) => {
  if (!props.persistent && props.fullscreen) onClose()
}
</script>
