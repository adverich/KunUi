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

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { kunBadgeProps } from '../composables/kunBadgeProps.js'
import { kunVariantClasses } from '../../../../theme/kunVariants.js'
import { hasExplicitDimensionClass } from '../../../../theme/kunSizes.js'

const props = defineProps(kunBadgeProps);
const attrs = useAttrs();

defineOptions({ inheritAttrs: false })

const isCircle = computed(() => props.rounded === 'full')

const hasCustomDimension = computed(() => hasExplicitDimensionClass(attrs.class))

const fontPx = computed(() => {
  const raw = String(props.textSize);
  const arbitrary = raw.match(/text-\[(\d+(?:\.\d+)?)px\]/);
  if (arbitrary) return Number(arbitrary[1]);
  const map: Record<string, number> = {
    'text-xs': 12,
    'text-sm': 14,
    'text-base': 16,
    'text-lg': 18,
    'text-xl': 20,
    'text-2xl': 24,
  };
  const token = raw.split(/\s+/).find((value) => value in map);
  return token ? map[token] : 12;
});

const circleSide = computed(() => {
  const base = Math.max(20, Math.round(fontPx.value * 1.65));
  const length = String(props.text ?? '').trim().length;
  if (props.dot || !length) return base;
  return Math.max(base, Math.ceil(length * fontPx.value * 0.62 + 8));
});

const computedClass = computed(() => [
  isCircle.value ? 'p-0' : 'px-2 py-1 min-w-[20px] min-h-[20px]',
  'flex items-center justify-center',
  kunVariantClasses(props.color, 'solid'),
  props.rounded === 'none'
    ? 'rounded-none'
    : props.pill || props.rounded === 'full' ? 'rounded-full' : 'rounded-sm',
  isCircle.value && hasCustomDimension.value ? 'aspect-square' : '',
  props.textSize,
  props.fontWeight,
  props.cursor
].filter(Boolean))

const positionClass = computed(() => {
  const map: Record<string, string> = {
    top: 'top-0',
    center: 'top-1/2',
    bottom: 'bottom-0',
    left: 'left-0',
    right: 'right-0',
    'center-x': 'left-1/2',
    'center-y': 'top-1/2',
  };

  const [vertical, horizontal] = (props.position as string).split(' ');

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
  `.trim(),
  ...(isCircle.value && !hasCustomDimension.value
    ? { width: `${circleSide.value}px`, height: `${circleSide.value}px` }
    : {}),
}));

</script>