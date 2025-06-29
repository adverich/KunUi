<template>
  <div :class="wrapperClasses">
    <!-- Label -->
    <slot name="label" v-bind="{ label, isFocused, isActive: !!internalValue, controlRef: textareaRef, focus: () => textareaRef?.focus(), blur: () => textareaRef?.blur(), props }">
      <label v-if="label" class="block text-sm font-medium mb-1">
        {{ label }}
      </label>
    </slot>

    <div class="relative">
      <!-- Prepend Icon -->
      <div v-if="prependIcon || $slots.prepend" class="absolute left-2 top-2 flex items-center">
        <slot name="prepend" v-bind="prependSlotBindings">
          <div @click="handleIconClick($event, 'prepend')">
            <component :is="renderIconSlot(prependIcon)" />
          </div>
        </slot>
      </div>

      <!-- Prepend-inner Icon -->
      <div v-if="prependInnerIcon || $slots['prepend-inner']" class="absolute left-2 top-2 ml-1">
        <slot name="prepend-inner">
          <div @click="handleIconClick($event, 'prependInner')">
            <component :is="renderIconSlot(prependInnerIcon)" />
          </div>
        </slot>
      </div>

      <!-- Textarea -->
      <textarea
        ref="textareaRef"
        :value="internalValue"
        :rows="rows"
        :disabled="disabled"
        :readonly="readonly"
        :placeholder="placeholder"
        @input="e => { updateValue(e.target.value); if (autoGrow) adjustHeight() }"
        @focus="isFocused = true; $emit('update:focused', true)"
        @blur="isFocused = false; $emit('update:focused', false)"
        @click="$emit('click:control', $event)"
        @mousedown="$emit('mousedown:control', $event)"
        :class="[variantClass, densityClass, inputClasses]"
      />

      <!-- Clear -->
      <div
        v-if="clearable && internalValue"
        class="absolute right-2 top-2"
        :class="{ 'opacity-100': persistentClear, 'hover:opacity-100 opacity-0 transition-opacity duration-200': !persistentClear }"
      >
        <slot
          name="clear"
          v-bind="{ isActive: !!internalValue, isFocused, controlRef: textareaRef, focus: () => textareaRef?.focus(), blur: () => textareaRef?.blur(), props }"
        >
          <button
            type="button"
            @click="handleClear"
            class="text-gray-500 hover:text-gray-700"
          >
            <span :class="clearIcon" />
          </button>
        </slot>
      </div>

      <!-- Append-inner Icon -->
      <div v-if="appendInnerIcon || $slots['append-inner']" class="absolute right-2 top-2 mr-1">
        <slot name="append-inner">
          <div @click="handleIconClick($event, 'appendInner')">
            <component :is="renderIconSlot(appendInnerIcon)" />
          </div>
        </slot>
      </div>

      <!-- Append Icon -->
      <div v-if="appendIcon || $slots.append" class="absolute right-2 top-2 flex items-center">
        <slot name="append" v-bind="appendSlotBindings">
          <div @click="handleIconClick($event, 'append')">
            <component :is="renderIconSlot(appendIcon)" />
          </div>
        </slot>
      </div>

      <!-- Loader -->
      <div v-if="loading" class="mt-1">
        <slot name="loader" :color="loadingColor" :isActive="true">
          <div class="h-1 w-full bg-gray-200 rounded overflow-hidden">
            <div
              class="h-full transition-all duration-300"
              :class="[`${loadingColor}`]"
              style="width: 100%"
            ></div>
          </div>
        </slot>
      </div>

      <!-- Details -->
      <div
        v-if="!hideDetails || (hideDetails === 'auto' && (displayedMessages.length || hint))"
        class="text-xs mt-1 space-y-1"
        :class="{ 'text-red-500': hasError, 'text-gray-500': !hasError }"
      >
        <slot name="details">
          <template v-if="hasError">
            <template v-for="(msg, i) in displayedMessages" :key="i">
              <slot name="message" :message="msg">
                <div>{{ msg }}</div>
              </slot>
            </template>
          </template>
          <template v-else-if="hint">
            <slot name="hint" :hint="hint">
              <div v-show="persistentHint || isFocused">{{ hint }}</div>
            </slot>
          </template>
        </slot>
      </div>

      <!-- Counter -->
      <div v-if="counterVisible" class="text-xs text-right mt-1 text-gray-400">
        <slot name="counter" :counter="internalValue.length" :max="counterMax" :value="internalValue.length">
          {{ internalValue.length }}<span v-if="counterMax"> / {{ counterMax }}</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue'
import { kunTextareaProps } from '../composables/kunTextareaProps'
import { useKunTextarea } from '../composables/useKunTextareaComposable'
import { renderIconSlot } from '@/utils/renderIcon'

const props = defineProps(kunTextareaProps)
const emits = defineEmits(['update:modelValue', 'click:clear', 'click:control', 'update:focused', 'mousedown:control'])

const textareaRef = ref(null)

const {
  isFocused,
  internalValue,
  updateValue,
  handleClear,
  adjustHeight,
  validate,
  reset,
  resetValidation,
  validationErrors,
  hasError,
  displayedMessages,
} = useKunTextarea(props, emits, textareaRef)

const variantClass = computed(() => {
  const hasCustomBg = !!props.bgColor

  switch (props.variant) {
    case 'filled':
      return [
        hasCustomBg ? '' : 'bg-gray-100 dark:bg-gray-900',
        'border border-transparent',
      ]
    case 'outlined':
      return 'border border-gray-300 bg-transparent'
    case 'underlined':
      return 'border-b border-gray-300 bg-transparent rounded-none'
    case 'solo':
      return [
        hasCustomBg ? '' : 'bg-white dark:bg-black',
        'shadow-md border-transparent',
      ]
    default:
      return ''
  }
})

const densityClass = computed(() => {
  switch (props.density) {
    case 'comfortable': return 'py-2'
    case 'compact': return 'py-1 text-sm'
    default: return ''
  }
})

const inputClasses = computed(() => [
  'w-full resize-none p-2 transition-colors duration-150',
  props.inputClass,
  {
    'rounded-md': !props.tile,
    'rounded-none': props.tile,
    [`rounded-${props.rounded}`]: typeof props.rounded === 'string' || typeof props.rounded === 'number',
    'shadow-md': props.variant === 'solo' && !props.flat,
    'shadow-none': props.flat,
    [`text-${props.textColor}`]: props.textColor,
    [`${props.bgColor}`]: props.bgColor,
    'text-gray-500 bg-gray-200': props.disabled,
    'focus:outline-none focus:ring-2': !props.disabled,
    [`focus:ring-${props.color}`]: props.color && !props.disabled && !hasError.value,
    'border-red-500 ring-red-500 focus:ring-red-500': hasError.value,
    'resize-none': props.noResize || props.autoGrow,
    'resize': !props.noResize && !props.autoGrow,
  }
])

const wrapperClasses = computed(() => [
  'relative w-full',
  props.class,
  props.wrapperClass,
])

const counterMax = computed(() => {
  if (props.counter === true) return 25
  if (typeof props.counter === 'number' || typeof props.counter === 'string') return props.counter
  return null
})

const counterVisible = computed(() => {
  if (props.persistentCounter) return true
  return !!props.counter && isFocused.value
})

const clearIcon = computed(() => {
  return typeof props.clearIcon === 'string'
    ? props.clearIcon
    : 'i-heroicons-x-mark-20-solid' // o cualquier ícono por defecto
})

function handleIconClick(event, type) {
  emits(`click:${type}`, event)
}

defineExpose({
  validate,
  reset,
  resetValidation,
  errorMessages: displayedMessages,
  isValid: computed(() => !hasError.value),
})
</script>
