<template>
  <div class="relative inline-block">
    <slot />
    <div
      v-if="visible"
      :class="[ ...positionClass, ...computedClass ]"
      :style="style"
      v-bind="$attrs"
    >
      <span v-if="!dot">{{ text }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { kunBadgeProps } from '../composables/kunBadgeProps'

const props = defineProps(kunBadgeProps);

defineOptions({ inheritAttrs: false })

const computedClass = computed(() => [
  'px-2 py-1 min-w-[20px] min-h-[20px] flex items-center justify-center',
  props.bgColor,
  props.textColor,
  props.textSize,
  props.fontWeight,
  props.rounded,
  props.cursor
].filter(Boolean))

const positionClass = computed(() => {
  const map = {
    top: 'top-0',
    center: 'top-1/2',
    bottom: 'bottom-0',
    left: 'left-0',
    right: 'right-0',
    'center-x': 'left-1/2',
    'center-y': 'top-1/2',
  };

  const [vertical, horizontal] = props.position.split(' ');

  return [
    map[vertical] || '',
    horizontal === 'center' ? 'left-1/2' : map[horizontal],
    vertical === 'center' ? 'top-1/2' : '',
    'absolute',
    'transform',
    horizontal === 'center' ? '-translate-x-1/2' : '',
    vertical === 'center' ? '-translate-y-1/2' : ''
  ].filter(Boolean);
});

const style = computed(() => ({
  transform: `
    ${props.position.includes('center') ? 'translate(-50%, -50%)' : ''}
    translate(${props.ejeX}px, ${props.ejeY}px)
  `.trim()
}));

</script>