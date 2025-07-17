<script setup>
import { computed, provide, toRefs } from 'vue'

const props = defineProps({
  modelValue: [String, Number, Boolean, Object],
  color: String,
  baseColor: String,
  name: String,
  disabled: Boolean,
  readonly: Boolean,
  direction: { type: String, default: 'vertical' }, // 'horizontal' | 'vertical'
  inline: Boolean,
  error: Boolean,
  trueIcon: { type: [String, Object], default: 'mdi-radiobox-marked' },
  falseIcon: { type: [String, Object], default: 'mdi-radiobox-blank' },
  label: String,
})

const emit = defineEmits(['update:modelValue'])

const update = (val) => {
  if (!props.readonly && !props.disabled) {
    emit('update:modelValue', val)
  }
}

provide('kun-radio-group', {
  modelValue: computed(() => props.modelValue),
  update,
})
</script>

<template>
  <div class="w-full" role="radiogroup">
    <slot name="label">
      <div v-if="label" class="block mb-1 text-sm font-medium">{{ label }}</div>
    </slot>

    <div :class="[
        direction === 'horizontal' || inline ? 'flex flex-wrap gap-4' : 'flex flex-col gap-2',
        disabled ? 'opacity-60 pointer-events-none' : ''
      ]"
    >
      <slot />
    </div>
  </div>
</template>
