<template>
  <component
    :is="to ? 'router-link' : tag"
    :to="to"
    :data-value="value"
    :class="[
      'relative inline-flex items-center justify-center whitespace-nowrap transition-all px-4 py-2 cursor-pointer',
      stacked ? 'flex-col gap-1' : '',
      isSelected ? selectedClass : baseColor,
      disabled ? 'opacity-50 pointer-events-none' : '',
      colorClass,
    ]"
    @click="onClick"
    ref="tabRef"
  >
    <slot name="prepend" v-if="prependIcon">
      <KunIcon :icon="prependIcon" />
    </slot>

    <slot>
      <span v-if="text">{{ text }}</span>
    </slot>

    <slot name="append" v-if="appendIcon">
      <KunIcon :icon="appendIcon" />
    </slot>
  </component>
</template>

<script setup>
import { ref, onMounted, inject, computed } from 'vue'
import KunIcon from '@/components/KunIcon/src/components/KunIcon.vue'

const props = defineProps({
  value: [String, Number],
  text: [String, Number],
  prependIcon: String,
  appendIcon: String,
  disabled: Boolean,
  stacked: Boolean,
  selectedClass: {
    type: String,
    default: 'text-primary font-medium',
  },
  baseColor: {
    type: String,
    default: 'text-slate-500 dark:text-slate-300',
  },
  colorClass: {
    type: String,
    default: '',
  },
  tag: {
    type: String,
    default: 'button',
  },
  to: [String, Object],
})

const emit = defineEmits(['update:modelValue'])

const groupValue = inject('modelValue')
const updateValue = inject('updateModelValue')
const registerTab = inject('registerTab')

const tabRef = ref(null)

const isSelected = computed(() => {
  if (Array.isArray(groupValue?.value)) {
    return groupValue.value.includes(props.value)
  }
  return groupValue?.value === props.value
})

onMounted(() => {
  registerTab?.(tabRef.value)
})

const onClick = () => {
  if (!props.disabled && props.value !== undefined) {
    updateValue?.(props.value)
    emit('update:modelValue', props.value)
  }
}
</script>
