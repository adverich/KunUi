<template>
  <div class="relative w-full">
    <label v-if="label" class="block text-sm font-medium mb-1">
      {{ label }}
    </label>

    <div
      class="flex items-center gap-2 rounded px-3 py-2 cursor-pointer transition"
      :class="[
        variant === 'outlined' ? 'border border-slate-400 dark:border-slate-600' :
        variant === 'solo' ? 'border-slate-400 dark:border-slate-600 shadow-inner' :
        'bg-slate-200 dark:bg-slate-800 border border-slate-400 dark:border-slate-600',
        disabled ? 'border-slate-400 dark:border-slate-600 cursor-not-allowed' : 'hover:border-blue-500',
        error || validationErrors.length ? 'border-red-500' : '',
        isFocused ? 'ring-2 ring-blue-500' : '',
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
          <span v-else class="text-gray-400">Seleccionar archivo</span>
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
        class="text-gray-500 hover:text-red-500"
      >
        <span v-if="clearIcon">{{ renderIconSlot(clearIcon) }}</span>
        <span v-else>✕</span>
      </button>
    </div>

    <div v-if="hint || validationErrors.length" class="mt-1 text-sm">
      <div v-if="validationErrors.length" class="text-red-500">
        <div v-for="(msg, i) in validationErrors" :key="i">{{ msg }}</div>
      </div>
      <div v-else-if="hint" class="text-gray-500">
        {{ hint }}
      </div>
    </div>

    <div v-if="counter" class="mt-1 text-xs text-gray-400 text-right">
      {{ counterString ?? `${fileNames.length} archivo(s)` }}
      <span v-if="showSize"> — {{ totalBytesReadable }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineEmits, defineExpose } from 'vue'
import { renderIconSlot } from '@/utils/renderIcon'

const props = defineProps({
  modelValue: [File, Array],
  multiple: Boolean,
  clearable: Boolean,
  chips: Boolean,
  showSize: [Boolean, Number],
  label: String,
  disabled: Boolean,
  error: Boolean,
  errorMessages: [String, Array],
  hint: String,
  persistentHint: Boolean,
  counter: Boolean,
  counterString: String,
  counterSizeString: String,
  prependIcon: String,
  appendIcon: String,
  clearIcon: String,
  variant: {
    type: String,
    default: 'filled',
  },
  rules: {
    type: Array,
    default: () => [],
  },
})

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
