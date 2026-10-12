<template>
  <component :is="props.tag" v-bind="$attrs" :class="computedClasses"
    :style="numericSize ? { width: numericSize, height: numericSize } : undefined"
    @click="$emit('click', $event)"
    @mouseover="$emit('hover', $event)" @contextmenu="$emit('contextmenu', $event)" @focus="$emit('focus', $event)">
    <img v-if="props.image" :src="props.image" :alt="props.alt" :class="computedImageClasses" />
    <span v-else-if="props.icon" :class="computedIconClasses">
      <KunIcon v-if="useKunIcon" :icon="(props.icon as any)" size="text-xl" />
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

const props = defineProps(kunAvatarProps);
const attrs = useAttrs();

defineEmits(["click", "hover", "contextmenu", "focus"]);

const sizes: Record<string, string> = {
  "x-small": "w-6 h-6 text-xs",
  small: "w-8 h-8 text-sm",
  default: "w-12 h-12 text-base",
  large: "w-16 h-16 text-lg",
  "x-large": "w-24 h-24 text-xl",
};

// Orden de menor a mayor para escalar por densidad.
const sizeOrder = ["x-small", "small", "default", "large", "x-large"];
const densityOffset: Record<string, number> = { compact: -2, comfortable: -1, default: 0 };

// size numérico → dimensiones explícitas escaladas por densidad.
const numericSize = computed(() => {
  const raw =
    typeof props.size === "number"
      ? props.size
      : /^\d+$/.test(String(props.size ?? ""))
        ? Number(props.size)
        : null;
  if (raw == null || !Number.isFinite(raw) || raw <= 0) return null;
  const scale = props.density === "compact" ? 0.75 : props.density === "comfortable" ? 0.875 : 1;
  return `${Math.max(1, Math.round(raw * scale))}px`;
});

// size nominal → clase del mapa, desplazada por densidad (piso en x-small).
const namedSizeClass = computed(() => {
  let i = sizeOrder.indexOf(String(props.size));
  if (i < 0) i = 2;
  const off = densityOffset[String(props.density)] ?? 0;
  return sizes[sizeOrder[Math.max(0, i + off)]] || sizes.default;
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
  return hasBackgroundClass.value ? '' : 'bg-ui-surface-subtle';
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
  "relative flex items-center justify-center overflow-hidden cursor-pointer transition-all",
  numericSize.value ? "" : namedSizeClass.value,
  props.rounded ? "rounded-full" : props.tile ? "rounded-none" : "rounded",
  props.border ? `border border-${props.border}` : "",
  bgClass.value,
  variantClasses.value,
  props.theme ? `theme-${props.theme}` : "",
  props.density === "compact" ? "p-1" : props.density === "comfortable" ? "p-2" : "p-3",
  props.start ? "ms-2" : "",
  props.end ? "me-2" : "",
]);

const computedImageClasses = computed(() => [
  "w-full h-full object-cover",
]);

const computedIconClasses = computed(() => [
  "absolute text-ui-inverse text-xl",
]);

const computedTextClasses = computed(() => [
  "text-center font-semibold",
]);
</script>
