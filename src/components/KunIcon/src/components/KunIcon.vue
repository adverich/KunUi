<template>
  <span
    class="flex items-center"
    :class="[color, normalizedSize, cursorClass, disabled ? 'opacity-50' : '']"
    :style="sizeStyle"
    @click="handleClick"
     v-bind="$attrs"
  >
    <!-- Si hay slot, lo usa -->
    <slot v-if="$slots.default" />

    <!-- Si el icono es un componente, lo renderiza -->
    <component v-else-if="isComponent" :is="resolvedIcon" :class="[color, normalizedSize, contentClass]" :style="sizeStyle" />

    <!-- Si es una string, la interpreta como clase o SVG raw (dependiendo del consumidor) -->
    <span v-else 
      :class="[!isSvg ? resolvedIcon : '', color, normalizedSize, contentClass]"
      v-html="isSvg ? resolvedIcon : ''" 
    />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { kunIconProps } from '../composables/kunIconProps.js'
import { icons as bundledIcons } from '../../../../icons/index.js'

const props = defineProps(kunIconProps);

const emit = defineEmits(['click']);

function handleClick(event: MouseEvent): void {
  if (!props.disabled) emit('click', event);
}

const isSvg = computed(() =>
  typeof resolvedIcon.value === 'string' &&
  resolvedIcon.value.trim().toLowerCase().startsWith('<svg')
)

const resolvedIcon = computed(() => {
  if (Array.isArray(props.icon)) return props.icon[0];
  if (typeof props.icon === 'string' && props.icon.startsWith('$')) {
    const key = props.icon.slice(1);
    // Aliases del consumidor primero; si no, el set bundleado (`$star`, `$menuUpOutline`, ...).
    const resolved = props.aliases[key] || (bundledIcons as Record<string, unknown>)[key];
    if (resolved) return resolved;
    // Fallback digno: warn en dev + placeholder visible en vez de span vacío.
    if (import.meta.env?.DEV) {
      console.warn(
        `[KunIcon] alias no resuelto: "$${key}". Claves disponibles:`,
        Object.keys(bundledIcons).sort(),
      );
    }
    return (bundledIcons as Record<string, unknown>)['info'] || '';
  }
  return props.icon;
});

const isComponent = computed(() =>
  typeof resolvedIcon.value === 'function' ||
  (resolvedIcon.value && typeof resolvedIcon.value === 'object' && ('render' in resolvedIcon.value || 'setup' in resolvedIcon.value))
);

const normalizedSize = computed(() => {
  const rawSize: unknown = Array.isArray(props.icon) ? props.icon[1] : props.size;
  if (!rawSize) return 'text-base';
  // Numérico → clase base + `sizeStyle` inline (Tailwind no genera `text-[Npx]` dinámico).
  if (typeof rawSize === 'number' || (typeof rawSize === 'string' && /^\d+$/.test(rawSize))) {
    return 'text-base';
  }
  return rawSize as string;
});

/** `font-size` inline cuando `size` (o `[icono, tamaño]`) es numérico. */
const sizeStyle = computed(() => {
  const rawSize: unknown = Array.isArray(props.icon) ? props.icon[1] : props.size;
  if (typeof rawSize === 'number' || (typeof rawSize === 'string' && /^\d+$/.test(rawSize))) {
    return { fontSize: `${String(rawSize)}px` };
  }
  return undefined;
});

const cursorClass = computed(() => {
  if (props.cursor) return props.cursor;
  return props.disabled ? 'cursor-not-allowed' : 'cursor-pointer';
});
</script>
