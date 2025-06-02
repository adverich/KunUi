<script setup>
import { computed, defineEmits } from 'vue'

const props = defineProps({
  modelValue: { type: [Boolean, String, Number], default: false },
  trueValue: { type: [Boolean, String, Number], default: true },
  falseValue: { type: [Boolean, String, Number], default: false },

  label: String,
  labelPosition: { type: String, default: 'right' }, // 'top', 'bottom', 'left', 'right'
  disabled: Boolean,
  onColor: { type: String, default: 'bg-green-600' },
  offColor: { type: String, default: 'bg-gray-300' },
  iconColor: { type: String, default: 'bg-white' },
  inset: Boolean,
  hideDetails: { type: Boolean, default: false },

  size: {
    type: String,
    default: 'md',
    validator: (val) =>
      ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'].includes(val),
  },
})

const emit = defineEmits(['update:modelValue'])

const isChecked = computed(() => props.modelValue === props.trueValue)

const toggle = () => {
  if (!props.disabled) {
    emit(
      'update:modelValue',
      isChecked.value ? props.falseValue : props.trueValue
    )
  }
}

const vertical = computed(() =>
  props.labelPosition === 'top' || props.labelPosition === 'bottom'
)

// Tamaños predefinidos
const sizeClasses = {
  xxs: {
    outer: 'w-6 h-3',
    thumb: 'w-3 h-3',
    icon: 'text-[10px]',
    translate: 'translate-x-3',
  },
  xs: {
    outer: 'w-8 h-4',
    thumb: 'w-4 h-4',
    icon: 'text-xs',
    translate: 'translate-x-4',
  },
  sm: {
    outer: 'w-9 h-5',
    thumb: 'w-4 h-4',
    icon: 'text-sm',
    translate: 'translate-x-4.5',
  },
  md: {
    outer: 'w-10 h-6',
    thumb: 'w-6 h-6',
    icon: 'text-base',
    translate: 'translate-x-4.25',
  },
  lg: {
    outer: 'w-12 h-7',
    thumb: 'w-7 h-7',
    icon: 'text-lg',
    translate: 'translate-x-5',
  },
  xl: {
    outer: 'w-14 h-8',
    thumb: 'w-8 h-8',
    icon: 'text-xl',
    translate: 'translate-x-6',
  },
  xxl: {
    outer: 'w-16 h-9',
    thumb: 'w-9 h-9',
    icon: 'text-2xl',
    translate: 'translate-x-7',
  },
}

const currentSize = computed(() => sizeClasses[props.size] || sizeClasses.md)
</script>

<template>
  <div
    class="select-none"
    :class="{ 'opacity-50 cursor-not-allowed': disabled, 'pl-6': inset }"
    v-bind="$attrs"
  >
    <!-- Vertical -->
    <template v-if="vertical">
      <label class="flex flex-col items-center gap-1 cursor-pointer">
        <span v-if="label && labelPosition === 'top'" class="text-sm text-gray-900">
          {{ label }}
        </span>

        <!-- Switch -->
        <div
          class="relative rounded-full transition-colors duration-200 cursor-pointer"
          :class="[currentSize.outer, isChecked ? onColor : offColor]"
          role="switch"
          :aria-checked="isChecked"
          :aria-disabled="disabled"
          tabindex="0"
          @click="toggle"
          @keydown.space.prevent="toggle"
          @keydown.enter.prevent="toggle"
        >
            <div
                class="absolute top-0 left-0 rounded-full shadow-md transform transition-transform duration-200 flex items-center justify-center"
                :class="[
                    iconColor,
                    currentSize.thumb,
                    currentSize.icon,
                    isChecked ? currentSize.translate : 'translate-x-0'
                ]"
            >
            <slot v-if="isChecked" name="on-icon" />
            <slot v-else name="off-icon" />
          </div>
        </div>

        <span v-if="label && labelPosition === 'bottom'" class="text-sm text-gray-900">
          {{ label }}
        </span>
      </label>
    </template>

    <!-- Horizontal -->
    <template v-else>
      <label
        class="flex items-center gap-3 cursor-pointer"
        :class="{ 'flex-row-reverse': labelPosition === 'left' }"
      >
        <!-- Switch -->
        <div
          class="relative rounded-full transition-colors duration-200"
          :class="[currentSize.outer, isChecked ? onColor : offColor]"
          role="switch"
          :aria-checked="isChecked"
          :aria-disabled="disabled"
          tabindex="0"
          @click="toggle"
          @keydown.space.prevent="toggle"
          @keydown.enter.prevent="toggle"
        >
            <div
                class="absolute top-0 left-0 rounded-full shadow-md transform transition-transform duration-200 flex items-center justify-center"
                :class="[
                    iconColor,
                    currentSize.thumb,
                    currentSize.icon,
                    isChecked ? currentSize.translate : 'translate-x-0'
                ]"
            >
                <slot v-if="isChecked" name="on-icon" />
                <slot v-else name="off-icon" />
            </div>
        </div>

        <div v-if="label" class="text-sm text-gray-900">
          {{ label }}
        </div>
      </label>
    </template>

    <!-- Details -->
    <div v-if="!hideDetails" class="text-xs text-gray-500 mt-1 ml-14" v-bind="$attrs">
      <slot name="details" />
    </div>
  </div>
</template>
