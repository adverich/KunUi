<template>
  <component :is="props.tag" v-bind="$attrs" :class="computedClasses"
    :style="numericStyle"
    @click="$emit('click', $event)"
    @mouseover="$emit('hover', $event)" @contextmenu="$emit('contextmenu', $event)" @focus="$emit('focus', $event)">
    <img v-if="props.image" :src="props.image" :alt="props.alt" :class="computedImageClasses" />
    <span v-else-if="props.icon" :class="computedIconClasses">
      <KunIcon v-if="useKunIcon" :icon="(props.icon as any)" :size="resolvedIconSize" />
      <template v-else>{{ props.icon }}</template>
    </span>
    <span v-else-if="props.text" :class="computedTextClasses">{{ props.text }}</span>
    <slot v-if="!props.image && !props.icon && !props.text"></slot>
  </component>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";
import KunIcon from '../../../KunIcon/src/components/KunIcon.vue'
import { kunAvatarProps } from '../composables/kunAvatarProps.js'
import {
  isKunSize,
  shiftKunSize,
  KUN_ICON_SIZE,
  KUN_SQUARE_SIZE,
  KUN_TEXT_SIZE,
  hasExplicitDimensionClass,
  type KunSize,
} from '../../../../theme/kunSizes.js'

const props = defineProps(kunAvatarProps);
const attrs = useAttrs();

defineEmits(["click", "hover", "contextmenu", "focus"]);

/** Nombres de la escala anterior que conservan su px como alias deprecado. */
const legacySizes: Record<string, KunSize | number> = {
  "3xs": "sm", // 32px
  "2xs": "md", // 36px
  "2xl": 72,
  "3xl": 80,
};

const densityOffset: Record<string, number> = { compact: -2, comfortable: -1, default: 0 };

const legacyPx = computed(() => {
  const legacy = legacySizes[String(props.size)];
  return typeof legacy === "number" ? legacy : null;
});

// size numérico → dimensiones explícitas escaladas por densidad.
const numericSize = computed(() => {
  const raw =
    typeof props.size === "number"
      ? props.size
      : /^\d+$/.test(String(props.size ?? ""))
        ? Number(props.size)
        : legacyPx.value;
  if (raw == null || !Number.isFinite(raw) || raw <= 0) return null;
  const scale = props.density === "compact" ? 0.75 : props.density === "comfortable" ? 0.875 : 1;
  return Math.max(1, Math.round(raw * scale));
});

const hasCustomDimension = computed(() => hasExplicitDimensionClass(attrs.class));

const isCircular = computed(() =>
  !props.tile &&
  props.rounded !== false &&
  props.rounded !== "none" &&
  !(typeof props.rounded === "string" && props.rounded !== "full")
);

const numericStyle = computed(() => {
  const px = numericSize.value;
  if (px == null) return undefined;
  return {
    ...(hasCustomDimension.value ? {} : { width: `${px}px`, height: `${px}px` }),
    fontSize: `${Math.max(10, Math.round(px * 0.4))}px`,
  };
});

const effectiveSize = computed<KunSize>(() => {
  const base = isKunSize(props.size)
    ? props.size
    : typeof legacySizes[String(props.size)] === "string"
      ? (legacySizes[String(props.size)] as KunSize)
      : "md";
  return shiftKunSize(base, densityOffset[String(props.density)] ?? 0);
});

// size nominal → clase compartida (cuadrado + tipografía), desplazada por densidad.
const namedSquareClass = computed(() =>
  numericSize.value == null && !hasCustomDimension.value
    ? KUN_SQUARE_SIZE[effectiveSize.value]
    : "",
);

const namedTextClass = computed(() =>
  numericSize.value == null ? KUN_TEXT_SIZE[effectiveSize.value] : "",
);

const resolvedIconSize = computed<string | number>(() => {
  if (numericSize.value != null) return Math.max(10, Math.round(numericSize.value * 0.5));
  return KUN_ICON_SIZE[effectiveSize.value];
});

const hasBackgroundClass = computed(() => {
  const classes = Array.isArray(attrs.class) ? attrs.class.join(' ') : String(attrs.class || '');
  return /(?:^|\s)(?:bg-|dark:bg-)/.test(classes);
});

// Alias `$nombre`, SVG inline o componente se resuelven vía KunIcon;
// cualquier otro string se muestra como texto (iniciales, unicode).
const useKunIcon = computed(() => {
  const icon = props.icon;
  if (icon == null) return false;
  if (typeof icon !== 'string') return true;
  const s = icon.trim().toLowerCase();
  return icon.startsWith('$') || s.startsWith('<svg');
});

const bgClass = computed(() => {
  if (props.variant === 'outlined' || props.variant === 'text') return 'bg-transparent';
  if (props.color) return `bg-${props.color}`;
  return hasBackgroundClass.value ? '' : 'bg-muted';
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'outlined': return 'border border-current';
    case 'tonal': return 'bg-opacity-30';
    case 'text':
    case 'flat':
    default: return '';
  }
});

const computedClasses = computed(() => [
  "relative flex items-center justify-center overflow-hidden cursor-pointer transition-all shrink-0",
  numericSize.value ? "" : [namedSquareClass.value, namedTextClass.value],
  isCircular.value && hasCustomDimension.value ? "aspect-square" : "",
  props.tile || props.rounded === false || props.rounded === 'none'
    ? "rounded-none"
    : typeof props.rounded === "string" && props.rounded !== "full"
      ? `rounded-${props.rounded}`
      : "rounded-full",
  props.border ? `border border-${props.border}` : "",
  bgClass.value,
  variantClasses.value,
  props.theme ? `theme-${props.theme}` : "",
  props.start ? "ms-2" : "",
  props.end ? "me-2" : "",
]);

const computedImageClasses = computed(() => [
  "w-full h-full object-cover",
]);

const computedIconClasses = computed(() => [
  "absolute text-inverted",
]);

const computedTextClasses = computed(() => [
  "text-center font-semibold",
]);
</script>
