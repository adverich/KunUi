<template>
  <div class="relative flex w-full flex-col">
    <label
      v-if="label"
      :class="[
        'absolute z-10 px-1 transition-all duration-200 ease-in-out pointer-events-none select-none',
        textClass,
        labelLeftClass,
        isLabelActive ? '-top-2.25 text-xs opacity-80' : 'top-3 text-sm opacity-80',
      ]"
    >
      {{ label }}
    </label>

    <div
      class="flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer transition"
      :class="[
        variantClass,
        textClass,
        disabled ? 'cursor-not-allowed' : 'hover:ring-primary',
        stateClass,
      ]"
      v-bind="$attrs"
      @click="() => inputRef?.click()"
      @focusin="onFocus"
      @focusout="onBlur"
    >
      <span v-if="prependIcon || $slots.prepend" class="flex items-center">
        <slot name="prepend">
          <KunIcon v-if="prependIcon" :icon="prependIcon" :size="iconSize" :disabled="disabled" />
        </slot>
      </span>

      <span v-if="prependInnerIcon || $slots['prepend-inner']" :class="prependInnerClass" class="flex items-center">
        <slot name="prepend-inner">
          <KunIcon v-if="prependInnerIcon" :icon="prependInnerIcon" :size="iconSize" :disabled="disabled" />
        </slot>
      </span>

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
          <span v-if="chips && fileNames.length" class="flex flex-wrap gap-1">
            <span v-for="(name, i) in fileNames" :key="i" class="inline-flex max-w-full items-center truncate rounded-sm bg-accented px-2 py-0.5 text-xs">{{ name }}</span>
          </span>
          <span v-else-if="fileNames.length">{{ fileNames.join(', ') }}</span>
          <span v-else class="text-disabled">Seleccionar archivo</span>
        </slot>
      </div>

      <span v-if="appendInnerIcon || $slots['append-inner']" :class="appendInnerClass" class="flex items-center">
        <slot name="append-inner">
          <KunIcon v-if="appendInnerIcon" :icon="appendInnerIcon" :size="iconSize" :disabled="disabled" />
        </slot>
      </span>

      <span v-if="appendIcon || $slots.append" class="flex items-center">
        <slot name="append">
          <KunIcon v-if="appendIcon" :icon="appendIcon" :size="iconSize" :disabled="disabled" />
        </slot>
      </span>

      <button
        v-if="clearable && fileNames.length"
        @click.stop="clearFiles"
        class="cursor-pointer text-muted hover:text-error"
      >
        <KunIcon :icon="clearIcon || '$close'" :size="iconSize" :disabled="disabled" />
      </button>
    </div>

    <div v-if="(hint && (persistentHint || isFocused)) || validationErrors.length || externalErrorList.length" class="mt-1 text-sm">
      <div v-if="validationErrors.length || externalErrorList.length" class="text-error">
        <div v-for="(msg, i) in validationErrors" :key="i">{{ msg }}</div>
        <div v-for="(msg, i) in externalErrorList" :key="`ext-${i}`">{{ msg }}</div>
      </div>
      <div v-else-if="hint && (persistentHint || isFocused)" class="text-muted">
        {{ hint }}
      </div>
    </div>

    <div v-if="counter" class="mt-1 text-xs text-disabled text-right">
      {{ counterString ?? `${fileNames.length} archivo(s)` }}
      <span v-if="showSize"> — {{ counterSizeString ?? totalBytesReadable }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, useSlots, type Ref, type ComputedRef } from 'vue'
import KunIcon from '../../../KunIcon/src/components/KunIcon.vue'
import { kunFileInputProps } from '../composables/kunFileInputProps.js'
import { resolveKunColor, resolveKunVariant, type KunColor, type KunVariant } from '../../../../theme/kunVariants.js'
import { kunFieldBaseClass, kunFieldTextClass, KUN_FIELD_ERROR_RING, KUN_FIELD_FOCUS_RING } from '@/utils/kunFieldVariant.js'

defineOptions({ inheritAttrs: false })

const props = defineProps(kunFileInputProps)

// Color/variante canónicos: prop > theme.defaults.input > (primary, subtle para
// este field). Foco/error resuelven ring literal por color (nunca interpolado).
const resolvedColor = computed<KunColor>(() => resolveKunColor(props.color ?? null, 'input'))
const resolvedVariant = computed<KunVariant>(() => resolveKunVariant(props.variant, 'input'))
const variantClass = computed(() => kunFieldBaseClass(resolvedVariant.value, resolvedColor.value))
const textClass = computed(() => kunFieldTextClass(resolvedVariant.value, resolvedColor.value))
const stateClass = computed(() => {
  if (props.disabled) return ''
  const hasErrors = props.error || validationErrors.value.length || externalErrorList.value.length
  if (hasErrors) return KUN_FIELD_ERROR_RING
  if (isFocused.value) return KUN_FIELD_FOCUS_RING[resolvedColor.value]
  return ''
})

const emit = defineEmits([
  'update:modelValue',
  'click:clear',
  'click:control',
  'update:focused',
  'change',
])

const inputRef: Ref<HTMLInputElement | null> = ref(null)
const isFocused = ref(false)
const internalValue: Ref<File[]> = ref([])
const validationErrors: Ref<string[]> = ref([])

watch(
  () => props.modelValue,
  (val: unknown) => {
    internalValue.value = Array.isArray(val) ? (val as File[]) : val ? [val as File] : []
  },
  { immediate: true }
)

function onFileChange(e: Event): void {
  const files = (e.target as HTMLInputElement).files
  if (!files) return
  const fileArray = Array.from(files)
  internalValue.value = props.multiple ? fileArray : [fileArray[0]]
  emit('update:modelValue', props.multiple ? fileArray : fileArray[0])
  emit('change', e)
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

const fileNames: ComputedRef<string[]> = computed(() => internalValue.value.map((f: File) => f.name))
const externalErrorList: ComputedRef<string[]> = computed(() => {
  const v = props.errorMessages as unknown
  if (v == null || v === '') return []
  return (Array.isArray(v) ? v : [v]).map((m: unknown) => String(m)).filter((m: string) => m !== '')
})
const isLabelActive = computed(() => props.dirty || isFocused.value || fileNames.value.length > 0)
const slots = useSlots()
const hasLeadingIcon = computed(() => !!(props.prependIcon || props.prependInnerIcon || slots.prepend || slots['prepend-inner']))
const labelLeftClass = computed(() => {
  if (isLabelActive.value) return 'left-2'
  if (hasLeadingIcon.value) return 'left-10'
  return 'left-2'
})
const totalBytes = computed(() => internalValue.value.reduce((acc: number, f: File) => acc + f.size, 0))
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

async function validate(silent = false): Promise<string[]> {
  const errors: string[] = []
  for (const rule of (props.rules as unknown[]) || []) {
    const result = typeof rule === 'function'
      ? (rule as (v: unknown) => unknown)(props.multiple ? internalValue.value : internalValue.value[0])
      : true
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

