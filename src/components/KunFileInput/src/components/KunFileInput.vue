<template>
  <div class="relative flex w-full flex-col">
    <label
      v-if="label"
      :class="[
        'absolute left-2 z-10 px-1 text-ui transition-all duration-200 ease-in-out pointer-events-none select-none',
        isLabelActive ? '-top-2.25 text-xs opacity-80' : 'top-3 text-sm opacity-80',
      ]"
    >
      {{ label }}
    </label>

    <div
      class="flex items-center gap-2 rounded px-3 py-2 cursor-pointer transition"
      :class="[
        variant === 'outlined' ? 'border border-ui' :
        variant === 'solo' ? 'border-ui shadow-inner' :
        'bg-surface border border-ui',
        disabled ? 'border-ui cursor-not-allowed' : 'hover:border-ui-primary',
        error || validationErrors.length ? 'border-error' : '',
        isFocused ? 'ring-2 ring-ui-focus' : '',
      ]"
      v-bind="$attrs" 
      @click="() => inputRef?.click()"
      @focusin="onFocus"
      @focusout="onBlur"
    >
      <slot name="prepend">
        <span v-if="prependIcon">
          {{ renderIconSlot(prependIcon) }}
        </span>
      </slot>

      <input
        ref="inputRef"
        type="file"
        class="hidden"
        :multiple="multiple"
        :disabled="disabled"
        @change="onFileChange"
      />

      <div class="flex-1 truncate">
        <slot name="selection" :fileNames="fileNames" :totalBytes="totalBytes" :totalBytesReadable="totalBytesReadable">
          <span v-if="fileNames.length">{{ fileNames.join(', ') }}</span>
          <span v-else class="text-ui-disabled">Seleccionar archivo</span>
        </slot>
      </div>

      <slot name="append">
        <span v-if="appendIcon">
          {{ renderIconSlot(appendIcon) }}
        </span>
      </slot>

      <button
        v-if="clearable && fileNames.length"
        @click.stop="clearFiles"
        class="cursor-pointer text-ui-muted hover:text-ui-error"
      >
        <span v-if="clearIcon">{{ renderIconSlot(clearIcon) }}</span>
        <span v-else>✕</span>
      </button>
    </div>

    <div v-if="hint || validationErrors.length" class="mt-1 text-sm">
      <div v-if="validationErrors.length" class="text-ui-error">
        <div v-for="(msg, i) in validationErrors" :key="i">{{ msg }}</div>
      </div>
      <div v-else-if="hint" class="text-ui-muted">
        {{ hint }}
      </div>
    </div>

    <div v-if="counter" class="mt-1 text-xs text-ui-disabled text-right">
      {{ counterString ?? `${fileNames.length} archivo(s)` }}
      <span v-if="showSize"> — {{ totalBytesReadable }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { renderIconSlot } from '@/utils/renderIcon'
import { kunFileInputProps } from '../composables/kunFileInputProps'

const props = defineProps(kunFileInputProps)

const emit = defineEmits([
  'update:modelValue',
  'click:clear',
  'click:control',
  'update:focused',
])

const inputRef = ref(null)
const isFocused = ref(false)
const internalValue = ref([])
const validationErrors = ref([])

watch(
  () => props.modelValue,
  (val) => {
    internalValue.value = Array.isArray(val) ? val : val ? [val] : []
  },
  { immediate: true }
)

function onFileChange(e) {
  const files = e.target.files
  if (!files) return
  const fileArray = Array.from(files)
  internalValue.value = props.multiple ? fileArray : [fileArray[0]]
  emit('update:modelValue', props.multiple ? fileArray : fileArray[0])
  validate()
}

function clearFiles() {
  internalValue.value = []
  emit('update:modelValue', props.multiple ? [] : null)
  emit('click:clear')
  validationErrors.value = []
}

function onFocus() {
  isFocused.value = true
  emit('update:focused', true)
}

function onBlur() {
  isFocused.value = false
  emit('update:focused', false)
}

const fileNames = computed(() => internalValue.value.map(f => f.name))
const isLabelActive = computed(() => props.dirty || isFocused.value || fileNames.value.length > 0)
const totalBytes = computed(() => internalValue.value.reduce((acc, f) => acc + f.size, 0))
const totalBytesReadable = computed(() => {
  const size = totalBytes.value
  const base = props.showSize === 1024 ? 1024 : 1000
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  let s = size
  while (s >= base && i < units.length - 1) {
    s /= base
    i++
  }
  return `${s.toFixed(1)} ${units[i]}`
})

async function validate(silent = false) {
  const errors = []
  for (const rule of props.rules) {
    const result = typeof rule === 'function' ? rule(props.multiple ? internalValue.value : internalValue.value[0]) : true
    if (typeof result === 'string') errors.push(result)
    else if (result === false) errors.push('Valor inválido')
  }
  validationErrors.value = errors
  if (!silent && errors.length) emit('update:focused', true)
  return errors
}

async function reset() {
  clearFiles()
}

async function resetValidation() {
  validationErrors.value = []
}

defineExpose({
  reset,
  resetValidation,
  validate,
  isValid: computed(() => validationErrors.value.length === 0),
  errorMessages: validationErrors,
})
</script>
