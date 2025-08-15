<template>
  <div :class="wrapperClasses" class="px-0.5" ref="rootRef" v-bind="restAttrs">
    <!-- Label -->
    <slot name="label" :for="uid" v-bind="labelSlotBindings">
      <label
        v-if="label"
        :for="uid"
        class="absolute left-2 transition-all duration-200 ease-in-out pointer-events-none select-none z-10"
        :class="isActive || placeholder ? '-top-2.25 text-xs opacity-80' : 'top-3 text-sm opacity-80'"
      >
        {{ label }}
      </label>
    </slot>

    <div class="relative ">

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

      <!-- Textarea Mejorado -->
      <textarea
        ref="textareaRef"
        :value="internalValue"
        :rows="autoGrow ? undefined : rows"
        :disabled="disabled"
        :readonly="readonly"
        :placeholder="placeholder"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @click="$emit('click:control', $event)"
        @mousedown="$emit('mousedown:control', $event)"
        class="bg-field-background"
        :class="[textareaClasses]"
        style="width: 100%; box-sizing: border-box; overflow-y: hidden;"
      ></textarea>

      <!-- Clear -->
      <div
        v-if="clearable && internalValue"
        class="absolute right-2 top-2"
        :class="clearIconClasses"
      >
        <slot name="clear" v-bind="clearSlotBindings">
          <button type="button" @click="handleClear" class="text-gray-500 hover:text-gray-700">
            <component :is="renderIconSlot(clearIcon)" />
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
          <div class="h-1 w-full bg-field-background rounded overflow-hidden">
            <div
              class="h-full transition-all duration-300"
              :class="[loadingColor]"
              style="width: 100%"
            />
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
        <slot name="counter" :counter="valueLength" :max="counterMax" :value="valueLength">
          {{ valueLength }}<span v-if="counterMax"> / {{ counterMax }}</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAttrs, computed, ref, getCurrentInstance, nextTick } from 'vue'
import { kunTextareaProps } from '../composables/kunTextareaProps'
import useTextarea from '../composables/useKunTextareaComposable'
import { renderIconSlot } from '@/utils/renderIcon'
import { debounce } from '@/utils/utils';

const props = defineProps({ ...kunTextareaProps })
const emits = defineEmits(['update:modelValue', 'click:clear', 'click:control', 'update:focused', 'mousedown:control'])
const attrs = useAttrs()

const textareaRef = ref(null)
const uid = `textarea-${getCurrentInstance().uid}`

const {
  isFocused,
  internalValue,
  updateModel,
  handleClear,
  validate,
  reset,
  resetValidation,
  hasError,
  displayedMessages,
  adjustHeight,
  handleJsonEnter,
} = useTextarea(props, emits, textareaRef)

const handleInput = (e) => {
  internalValue.value = e.target.value  // Actualiza el texto de inmediato
  debouncedUpdateModel(e.target.value) // Actualiza el modelo después del delay

  if (props.autoGrow) adjustHeight()
}
const debouncedUpdateModel = debounce((val) => {
  updateModel(val)
}, 100)

const handleFocus = () => {
  isFocused.value = true
  emits('update:focused', true)
}

const handleBlur = () => {
  isFocused.value = false
  emits('update:focused', false)
}

const isActive = computed(() => isFocused.value || !!internalValue.value || props.dirty)
const valueLength = computed(() => (typeof internalValue.value === 'string' ? internalValue.value.length : 0))
const counterMax = computed(() => (props.counter === true ? 25 : props.counter || null))
const counterVisible = computed(() => props.persistentCounter || (props.counter && isFocused.value))

const wrapperClasses = computed(() => ['relative w-full flex flex-col', props.class, props.wrapperClass])
const clearIconClasses = computed(() =>
  props.persistentClear ? 'opacity-100' : 'hover:opacity-100 opacity-0 transition-opacity duration-200'
)

const variantClass = computed(() => {
  const bg = props.bgColor ? '' : props.variant === 'filled' ? 'bg-field-background' : ''
  switch (props.variant) {
    case 'filled':
      return [bg, 'border border-transparent']
    case 'outlined':
      return 'border border-gray-300 dark:border-gray-700 bg-transparent'
    case 'underlined':
      return 'border-b border-gray-300 dark:border-gray-700 bg-transparent rounded-none'
    case 'solo':
      return [bg || 'bg-white dark:bg-black', 'shadow-md border-transparent']
    default:
      return ''
  }
})

const densityClass = computed(() =>
  props.density === 'compact' ? 'p-1' : props.density === 'comfortable' ? 'p-2' : 'p-3'
)

const textareaClasses = computed(() => [
  'w-full resize-none p-2 transition-colors duration-150 py-2',
  props.inputClass,
  {
    'rounded-md': !props.tile,
    'rounded-none': props.tile,
    [`rounded-${props.rounded}`]: typeof props.rounded === 'string' || typeof props.rounded === 'number',
    'shadow-md': props.variant === 'solo' && !props.flat,
    'shadow-none': props.flat,
    [`text-${props.textColor}`]: props.textColor,
    [props.bgColor]: props.bgColor,
    'text-gray-500 bg-surface': props.disabled,
    'focus:outline-none focus:ring-1': !props.disabled,
    [`${props.focusRingColor}`]: props.focusRingColor && !props.disabled && !hasError.value,
    'border-red-500 ring-red-500 focus:ring-red-500': hasError.value,
    'resize-none': props.noResize || props.autoGrow,
    'resize': !props.noResize && !props.autoGrow,
  },
  variantClass.value,
  densityClass.value,
])

const labelSlotBindings = {
  label: props.label,
  isFocused,
  isActive,
  controlRef: textareaRef,
  focus: () => textareaRef.value?.focus(),
  blur: () => textareaRef.value?.blur(),
  props,
}
const clearSlotBindings = {
  isActive: !!internalValue.value,
  isFocused,
  controlRef: textareaRef,
  focus: () => textareaRef.value?.focus(),
  blur: () => textareaRef.value?.blur(),
  props,
}
const prependSlotBindings = clearSlotBindings
const appendSlotBindings = clearSlotBindings

const restAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

defineExpose({
  validate,
  reset,
  resetValidation,
  errorMessages: displayedMessages,
  isValid: computed(() => !hasError.value),
  focus: () => textareaRef.value?.focus(),
  rootRef: textareaRef,
})
</script>
