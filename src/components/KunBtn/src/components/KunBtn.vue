<template>
  <component
    ref="rootEl"
    :is="componentTag"
    v-bind="componentAttrs"
    :class="computedClass"
    :style="attrs.style"
    :disabled="isButton && (loading || disabled)"
    @click="emits('click', $event)"
    @keydown="emits('keydown', $event)"
    @keyup="emits('keyup', $event)"
    @keypress="emits('keypress', $event)"
  >
    <div :class="['relative flex items-center justify-center', hasCustomWidth ? '' : 'w-full', hasCustomHeight ? '' : 'h-full']">
      <!-- Loader encima sin opacidad -->
      <template v-if="loading">
        <slot name="loader">
          <div class="absolute inset-0 flex items-center justify-center z-10">
            <KunLoaderCircular :size="loaderSize" :width="loaderWidth" />
          </div>
        </slot>
      </template>

      <!-- Contenido del botón con opacidad -->
      <div :class="[{ 'opacity-50': loading }, controlGap]" class="flex items-center justify-center w-full h-full">
        <!-- Prepend -->
        <template v-if="$slots.prepend || prependIcon">
          <span class="flex items-center">
            <slot name="prepend" />
            <component :is="renderIcon(prependIcon)" />
          </span>
        </template>

        <!-- Texto o ícono central -->
        <span v-if="text || $slots.default || icon" class="truncate flex items-center justify-center">
          <template v-if="icon && !text && !$slots.default">
            <component :is="renderIcon(icon)" />
          </template>
          <template v-else>
            <slot>{{ text }}</slot>
          </template>
        </span>

        <!-- Append -->
        <template v-if="$slots.append || appendIcon">
          <span class="flex items-center">
            <slot name="append" />
            <component :is="renderIcon(appendIcon)" />
          </span>
        </template>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs, useSlots, h, isVNode, Comment, Text, Fragment, type Ref, type VNode } from 'vue'
import { RouterLink } from 'vue-router'
import KunLoaderCircular from '@/components/KunLoaderCircular/src/components/KunLoaderCircular.vue';
import KunIcon from '@/components/KunIcon/src/components/KunIcon.vue'
import { kunBtnProps } from '../composables/kunBtnProps.js'
import { kunVariantClasses, resolveKunColor, resolveKunVariant, type KunColor } from '../../../../theme/kunVariants.js'
import {
  resolveKunSize,
  KUN_CONTROL_HEIGHT,
  KUN_CONTROL_PADDING,
  KUN_CONTROL_GAP,
  KUN_ICON_SIZE,
  KUN_ICON_PX,
  KUN_LOADER_WIDTH,
  KUN_SQUARE_SIZE,
  KUN_TEXT_SIZE,
  hasExplicitWidthClass,
  hasExplicitHeightClass,
} from '../../../../theme/kunSizes.js'

const slots = useSlots()
const attrs = useAttrs()

const props = defineProps(kunBtnProps)

const emits = defineEmits(['click', 'keydown', 'keyup', 'keypress'])

const isLink = computed(() => !!props.to || !!props.href)
const isButton = computed(() => !isLink.value)

const componentTag = computed(() => {
  if (props.href) return 'a'
  if (props.to) return RouterLink
  return 'button'
})

const resolvedColor = computed<KunColor>(() => resolveKunColor(props.color ?? null))
const resolvedVariant = computed(() => resolveKunVariant(props.variant ?? null))
const resolvedSize = computed(() => resolveKunSize(props.size))

/** Redondeo: 'full' | 'none' propios, o `rounded-md` (escala global). */
const roundedClass = computed(() => {
  if (props.rounded === 'full') return 'rounded-full'
  if (props.rounded === 'none') return 'rounded-none'
  return 'rounded-md'
})

const renderIcon = (icon: unknown) => {
  if (!icon || icon === false) return null;
  if (icon === true && !props.icon) return null;

  return h(KunIcon, {
    icon,
    size: resolvedIconSize.value,
    disabled: props.disabled,
  });
};

const componentAttrs = computed(() => {
  if (props.href) {
    return {
      href: props.href,
      target: props.target ?? '_self',
      rel: props.target === '_blank' ? 'noopener noreferrer' : null
    }
  }
  if (props.to) {
    return {
      to: props.to,
      replace: props.replace
    }
  }
  return {
    type: props.type,
    disabled: props.loading || props.disabled
  }
})

const hasCustomWidth = computed(() => hasExplicitWidthClass(attrs.class));

const hasCustomHeight = computed(() => hasExplicitHeightClass(attrs.class));

const buttonSize = computed(() =>
  [
    hasCustomHeight.value ? '' : KUN_CONTROL_HEIGHT[resolvedSize.value],
    KUN_CONTROL_PADDING[resolvedSize.value],
  ].filter(Boolean).join(' '),
)

const resolvedIconSize = computed(() => props.iconSize || KUN_ICON_SIZE[resolvedSize.value])

const loaderSize = computed(() => KUN_ICON_PX[resolvedSize.value])
const loaderWidth = computed(() => KUN_LOADER_WIDTH[resolvedSize.value])

const controlGap = computed(() => KUN_CONTROL_GAP[resolvedSize.value])

const variantClasses = computed(() => kunVariantClasses(resolvedColor.value, resolvedVariant.value))

const hasText = computed(() => !!props.text)

function meaningfulSlotNodes(nodes: VNode[]): VNode[] {
  return nodes.flatMap((node) => {
    if (node.type === Comment) return [];
    if (node.type === Text) return String(node.children ?? '').trim() ? [node] : [];
    if (node.type === Fragment) return meaningfulSlotNodes((node.children as VNode[]) ?? []);
    return [node];
  });
}

const hasSingleIconSlot = computed(() => {
  const content = slots.default?.();
  if (!content) return false;
  const nodes = meaningfulSlotNodes(content);
  return nodes.length === 1 && nodes[0]?.type === KunIcon;
});

const isIconOnly = computed(() => {
  const isSingleCharText = props.text?.length === 1 && !slots.default && !props.icon;
  const isIconPropOnly = !!props.icon && !props.text && !slots.default;
  return isIconPropOnly || hasSingleIconSlot.value || isSingleCharText;
});

/** Modo cuadrado: heredado automático de `isIconOnly` o forzado por la prop `square`. */
const isSquare = computed(() => props.square || isIconOnly.value)

const computedClass = computed(() => {
  const base = [
    'inline-flex items-center justify-center break-keep transition-all whitespace-nowrap',
    !isSquare.value ? buttonSize.value : '',
    KUN_TEXT_SIZE[resolvedSize.value],
    props.fontWeight,
    roundedClass.value,
    props.textAlign,
    variantClasses.value,
    'relative'
  ];

  if (attrs.class) base.push(attrs.class as string);

  if (isSquare.value) {
    base.push(
      hasCustomWidth.value || hasCustomHeight.value
        ? 'aspect-square'
        : KUN_SQUARE_SIZE[resolvedSize.value],
      'shrink-0',
    );
  }

  if (!props.loading && !props.disabled) {
    base.push(
      'hover:opacity-90',
      'focus:outline-none',
      props.ring ? 'focus:ring-2 focus:ring-offset-2' : '',
      'active:scale-[.98]',
      'transition duration-100 ease-in-out',
      'cursor-pointer',
    );
  } else {
    base.push('pointer-events-none');
    if (props.disabled) base.push('opacity-50 cursor-not-allowed');
  }

  // Solo aplicar minWidth si no hay clase de ancho personalizada ni modo cuadrado
  if (hasText.value && !isSquare.value && !hasCustomWidth.value) {
    base.push(props.minWidth);
  }

  return base.filter(Boolean);
});

const rootEl: Ref<HTMLElement | null> = ref(null);
defineExpose({
  focus: () => rootEl.value?.focus?.()
});
</script>
