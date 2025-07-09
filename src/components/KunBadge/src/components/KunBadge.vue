<template>
  <div class="relative inline-block">
    <slot />
    <div
      v-if="visible"
      :class="[...positionClass, bgColor, textColor, textSize, fontWeight, rounded, 'px-2 py-1 min-w-[20px] min-h-[20px] flex items-center justify-center']"
      :style="style"
      v-bind="$attrs"
    >
      <span v-if="!dot">{{ text }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  text: { type: [String, Number], default: '' },
  bgColor: { type: String, default: 'bg-red-500' },
  textColor: { type: String, default: 'text-white' },
  textSize: { type: String, default: 'text-xs' },
  fontWeight: { type: String, default: 'font-bold' },
  rounded: { type: String, default: 'rounded-full' },
  dot: { type: Boolean, default: false },
  visible: { type: Boolean, default: true },
  position: {
    type: String,
    default: 'top right',
    validator: (val) =>
      [
        'top left', 'top center', 'top right',
        'center left', 'center center', 'center right',
        'bottom left', 'bottom center', 'bottom right'
      ].includes(val)
  },
  ejeX: { type: [Number, String], default: 5 }, // desplazamiento horizontal
  ejeY: { type: [Number, String], default: 20 }  // desplazamiento vertical
});

defineOptions({ inheritAttrs: false })

const computedClass = computed(() => [
  'absolute -top-1 -right-1 flex items-center justify-center px-2 py-1',
  'transform translate-x-1/2 -translate-y-1/2',
  'min-w-[20px] min-h-[20px]',
  props.bgColor,
  props.textColor,
  props.textSize,
  props.fontWeight,
  props.rounded
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