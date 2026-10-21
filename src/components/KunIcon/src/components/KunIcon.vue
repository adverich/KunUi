<template>
  <span
    :class="rootClass"
    :style="rootStyle"
    v-bind="passthroughAttrs"
    @click="handleClick"
  >
    <!-- Si hay slot, lo usa -->
    <span v-if="$slots.default" :class="glyphClass" :style="glyphStyle">
      <slot />
    </span>

    <!-- Si el icono es un componente, lo renderiza -->
    <component
      v-else-if="isComponent"
      :is="resolvedIcon"
      :class="glyphClass"
      :style="glyphStyle"
    />

    <!-- Nombre Iconify (`i-mdi-home`, `mdi:home`, `lucide:x`): resuelto vía @iconify/vue. -->
    <component
      v-else-if="isIconify"
      :is="IconifyIcon"
      :icon="(resolvedIcon as string)"
      :class="glyphClass"
      :style="glyphStyle"
    />

    <!-- Si es una string, la interpreta como clase o SVG raw (dependiendo del consumidor) -->
    <span
      v-else
      :class="[!isSvg ? (resolvedIcon as string) : '', ...glyphClass]"
      :style="glyphStyle"
      v-html="isSvg ? (resolvedIcon as string) : ''"
    />
  </span>
</template>

<script setup lang="ts">
import { computed, useAttrs, defineAsyncComponent } from 'vue';
import { kunIconProps } from '../composables/kunIconProps.js'
import { kunIconAliases } from '../../../../icons/index.js'
import { ensureKunIcons } from '../../../../icons/loader.js'
import { kunConfig } from '../../../../config/kunConfig.js'
import {
  isKunSize,
  hasExplicitDimensionClass,
  KUN_ICON_SIZE,
  KUN_SQUARE_SIZE,
  type KunSize,
} from '../../../../theme/kunSizes.js'

defineOptions({ inheritAttrs: false })

const props = defineProps(kunIconProps);

const emit = defineEmits(['click']);

const attrs = useAttrs();

/** La `class` del consumidor va al elemento del ícono (para `text-…`, `size-…`, etc.). */
const passthroughClass = computed(() => attrs.class);
/** Resto de attrs (id, title, listeners, …) al wrapper. */
const passthroughAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});

/**
 * `@iconify/vue` se carga de forma perezosa (chunk aparte): solo se descarga
 * cuando se renderiza un nombre Iconify. Los íconos propios (subconjunto
 * `lucide`) vienen bundleados y se registran al cargar el módulo.
 */
const IconifyIcon = defineAsyncComponent(async () => {
  try {
    return await ensureKunIcons();
  } catch {
    if (import.meta.env?.DEV) {
      console.warn('[KunIcon] no se pudo cargar "@iconify/vue": los íconos Iconify no se resolverán.');
    }
    return { render: () => null };
  }
});

function handleClick(event: MouseEvent): void {
  if (!props.disabled) emit('click', event);
}

const isSvg = computed(() =>
  typeof resolvedIcon.value === 'string' &&
  resolvedIcon.value.trim().toLowerCase().startsWith('<svg')
)

const resolvedIcon = computed<unknown>(() => {
  if (Array.isArray(props.icon)) return props.icon[0];
  if (typeof props.icon === 'string' && props.icon.startsWith('$')) {
    const key = props.icon.slice(1);
    // Overrides (instancia → config global) primero; si no, el mapa de alias
    // (`$close`, `$menuUpOutline`, ...) que por defecto apunta a `lucide`.
    const resolved = props.aliases[key] ?? kunConfig.icons[key] ?? kunIconAliases[key];
    if (resolved) return resolved;
    // Fallback digno: warn en dev + placeholder visible en vez de span vacío.
    if (import.meta.env?.DEV) {
      console.warn(
        `[KunIcon] alias no resuelto: "$${key}". Claves disponibles:`,
        Object.keys(kunIconAliases).sort(),
      );
    }
    return props.aliases.info ?? kunIconAliases.info;
  }
  return props.icon;
});

/** Nombre Iconify: `i-<prefijo>-<nombre>` o `<prefijo>:<nombre>`. */
const isIconify = computed(() => {
  const value = resolvedIcon.value;
  if (typeof value !== 'string') return false;
  const name = value.trim();
  return /^i-[a-z0-9]+(?:-[a-z0-9]+)+$/i.test(name) || /^[a-z0-9]+(?:-[a-z0-9]+)*:[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(name);
});

const isComponent = computed(() =>
  typeof resolvedIcon.value === 'function' ||
  (resolvedIcon.value && typeof resolvedIcon.value === 'object' && ('render' in resolvedIcon.value || 'setup' in resolvedIcon.value))
);

const rawSize = computed<unknown>(() => (Array.isArray(props.icon) ? props.icon[1] : props.size));

const isNamedSize = computed(() => isKunSize(rawSize.value));

const isNumericSize = computed(() => {
  const value = rawSize.value;
  return typeof value === 'number' || (typeof value === 'string' && /^\d+(?:\.\d+)?$/.test(value.trim()));
});

/** Clase de tamaño: paso canónico, clase Tailwind libre o vacío (hereda). */
const normalizedSize = computed(() => {
  const value = rawSize.value;
  if (isNamedSize.value) return KUN_ICON_SIZE[value as KunSize];
  if (value === undefined || value === null || value === '' || isNumericSize.value) return '';
  return String(value).trim();
});

/** `width`/`height` inline cuando el tamaño es numérico (px). */
const isBoxed = computed(() => props.rounded !== null && props.rounded !== 'none');

const hasCustomDimension = computed(() => hasExplicitDimensionClass(attrs.class));

const roundedClass = computed(() => {
  if (!isBoxed.value) return '';
  return props.rounded === 'full' ? 'rounded-full' : `rounded-${props.rounded}`;
});

const sizeToken = computed(() => {
  const value = rawSize.value;
  return typeof value === 'string' ? value.trim() : '';
});

/** Lado de la caja cuando `rounded` está activo: 1:1 y sin pelear con clases del consumidor. */
const boxSizeClass = computed(() => {
  if (!isBoxed.value) return '';
  if (hasCustomDimension.value) return 'aspect-square';
  if (isNamedSize.value) return KUN_SQUARE_SIZE[rawSize.value as KunSize];
  if (isNumericSize.value) return '';
  if (hasExplicitDimensionClass(rawSize.value)) return sizeToken.value;
  return KUN_SQUARE_SIZE.md;
});

/** Clase del glifo: 50% del lado cuando la caja es canónica o custom. */
const glyphClass = computed<unknown[]>(() => {
  if (!isBoxed.value) {
    return [passthroughClass.value, normalizedSize.value, props.contentClass];
  }

  let sizeClass = 'size-[50%]';
  if (!hasCustomDimension.value && isNamedSize.value) {
    sizeClass = KUN_ICON_SIZE[rawSize.value as KunSize];
  } else if (!hasCustomDimension.value && isNumericSize.value) {
    sizeClass = '';
  } else if (!hasCustomDimension.value && sizeToken.value && !hasExplicitDimensionClass(rawSize.value)) {
    sizeClass = normalizedSize.value;
  }

  return [sizeClass, props.contentClass];
});

const rootClass = computed(() => {
  const base = isBoxed.value
    ? ['inline-flex items-center justify-center shrink-0', roundedClass.value, boxSizeClass.value, passthroughClass.value]
    : ['flex items-center'];
  return [...base, cursorClass.value, props.disabled ? 'opacity-50' : ''];
});

const boxStyle = computed(() => {
  if (!isBoxed.value || !isNumericSize.value || hasCustomDimension.value) return undefined;
  const px = `${String(rawSize.value).trim()}px`;
  return { width: px, height: px };
});

const rootStyle = computed(() => {
  if (!attrs.style) return boxStyle.value;
  return boxStyle.value ? [attrs.style, boxStyle.value] : attrs.style;
});

const glyphStyle = computed(() => {
  if (!isNumericSize.value || (isBoxed.value && hasCustomDimension.value)) return undefined;
  const value = Number(rawSize.value);
  const px = isBoxed.value ? Math.max(1, Math.round(value / 2)) : value;
  return { width: `${px}px`, height: `${px}px` };
});
const cursorClass = computed(() => {
  if (props.cursor) return props.cursor;
  return props.disabled ? 'cursor-not-allowed' : 'cursor-pointer';
});
</script>
