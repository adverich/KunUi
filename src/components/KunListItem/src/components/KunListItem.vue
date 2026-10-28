<template>
  <RouterLink
    v-if="isLink"
    :to="(to as any)"
    :replace="replace"
    :custom="true"
    v-slot="{ href, navigate, isActive: linkActive }"
  >
    <component
      :is="isLink ? 'a' : tag"
      :id="computedId"
      ref="liRef"
      :href="href"
      role="option"
      :aria-selected="isItemSelected || isActive || linkActive"
      :aria-disabled="disabled"
      tabindex="-1"
      :class="mergedItemClass" 
      @click="(e: MouseEvent) => handleClick(e, navigate)"
      @keydown.enter.prevent="(e: KeyboardEvent) => handleClick(e, navigate)"
      @keydown.space.prevent="(e: KeyboardEvent) => handleClick(e, navigate)"
      v-bind="$attrs"
    >
      <KunListItemInner
        :prepend-icon="prependIcon"
        :prepend-avatar="prependAvatar"
        :prepend-class="prependClass"
        :append-icon="appendIcon"
        :append-avatar="appendAvatar"
        :append-class="appendClass"
        :title="title"
        :title-class="titleClass"
        :subtitle="subtitle"
        :subtitle-class="subtitleClass"
        :content-class="contentClass"
        :other-attrs="otherAttrs"
      >
        <template v-if="$slots.prepend" #prepend><slot name="prepend" /></template>
        <template v-if="$slots.default" #default><slot /></template>
        <template v-if="$slots.title" #title><slot name="title" /></template>
        <template v-if="$slots.subtitle" #subtitle><slot name="subtitle" /></template>
        <template v-if="$slots.append" #append><slot name="append" /></template>
      </KunListItemInner>
    </component>
  </RouterLink>

  <component
    v-else
    :id="computedId"
    :is="props.href ? 'a' : tag"
    ref="liRef"
    :href="props.href || undefined"
    role="option"
    :aria-selected="isItemSelected || isActive"
    :aria-disabled="disabled"
    tabindex="-1"
    :class="[mergedItemClass]"
    @click="handleClick"
    @keydown.enter.prevent="handleClick"
    @keydown.space.prevent="handleClick"
    v-bind="$attrs"
  >
    <KunListItemInner
      :prepend-icon="prependIcon"
      :prepend-avatar="prependAvatar"
      :prepend-class="prependClass"
      :append-icon="appendIcon"
      :append-avatar="appendAvatar"
      :append-class="appendClass"
      :title="title"
      :title-class="titleClass"
      :subtitle="subtitle"
      :subtitle-class="subtitleClass"
      :content-class="contentClass"
      :other-attrs="otherAttrs"
    >
      <template v-if="$slots.prepend" #prepend><slot name="prepend" /></template>
      <template v-if="$slots.default" #default><slot /></template>
      <template v-if="$slots.title" #title><slot name="title" /></template>
      <template v-if="$slots.subtitle" #subtitle><slot name="subtitle" /></template>
      <template v-if="$slots.append" #append><slot name="append" /></template>
    </KunListItemInner>
  </component>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, onBeforeUnmount, computed, useAttrs, useId, type Ref, type ComponentPublicInstance } from 'vue'
import KunListItemInner from './KunListItemInner.vue';
import { RouterLink } from 'vue-router'
import { kunListItemProps } from '../composables/kunListItemProps.js'
import {
  kunVariantClasses,
  kunSelectedClasses,
  kunHoverClasses,
  type KunColor,
} from '../../../../theme/kunVariants.js'

interface KunListItemContext {
  toggleItem?: (value: unknown) => void;
  isSelected?: (value: unknown) => boolean;
  /** La lista contenedora gestiona selección (selectable). */
  gestiona?: boolean;
  color?: string;
}

const attrs = useAttrs();
const contentClass = computed(() => attrs.class || undefined)
const otherAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

const props = defineProps(kunListItemProps)

const emits = defineEmits(['click'])

const liRef: Ref<HTMLElement | ComponentPublicInstance | null> = ref(null)
const registerRef = inject<((el: HTMLElement | null) => void) | null>('registerListItemRef', null)
const listContext = inject<KunListItemContext | null>('kunListContext', null)

const generatedId = useId()
const computedId = computed(() => props.id || `kun-list-item-${generatedId}`)

onMounted(() => {
  if (registerRef && liRef.value) registerRef(liRef.value as unknown as HTMLElement)
})
onBeforeUnmount(() => {
  if (registerRef) registerRef(null)
})

// ------------------------------------------------------------------
// Selección por prioridad:
// 1) KunList contenedora que gestiona selección (`gestiona`) → el
//    estado lo decide `v-model:selected` de la lista (isSelected).
// 2) `v-model:selected` propio del ítem: un solo valor (primitivo u
//    objeto) compartido entre ítems hace que SOLO el que coincide
//    quede resaltado (selección single).
// 3) Sin v-model enlazado: cada ítem mantiene su propio valor interno
//    (útil para menús flotantes y uso suelto).
// ------------------------------------------------------------------
// `any` es el patrón documentado de la librería para defineModel de
// valor desconocido (ver AGENTS.md: `null` aceptado como vacío).
const itemSelected = defineModel<any>('selected', {
  type: [String, Number, Boolean, Object, Array],
  default: undefined,
})
const isItemSelected = computed(() => listContext?.isSelected?.(props.value) || itemSelected.value === props.value);
const isActive = computed(() => props.active);
const isLink = computed(() => !!props.to);

function handleClick(e: MouseEvent | KeyboardEvent, navigateFn: ((e?: MouseEvent) => unknown) | null = null): void {
  if (props.disabled) return
  emits('click', e)

  // Nueva pestaña si Ctrl/Cmd está presionado y el ítem es un enlace
  if ((e.ctrlKey || e.metaKey) && props.to) {
    const route = typeof props.to === 'string' ? props.to : (props.to as Record<string, string>).path
    window.open(route, '_blank')
    return
  }

  const el = (liRef.value as ComponentPublicInstance)?.$el ?? liRef.value as HTMLElement | undefined
  if (el?.dispatchEvent) {
    el.dispatchEvent(new CustomEvent('select', { detail: props.value, bubbles: true }))
  }

  if (props.selectable && props.value !== null && !props.disabled) {
    if (listContext?.gestiona) {
      listContext.toggleItem?.(props.value)
    } else {
      // Sin lista gestionando: v-model propio del ítem (o estado interno
      // si nadie lo enlaza). Un solo valor compartido => single selection.
      itemSelected.value = isItemSelected.value ? null : props.value
    }
    if (el?.dispatchEvent) {
      el.dispatchEvent(new CustomEvent('selected', { detail: props.value, bubbles: true }))
    }
  }

  if (navigateFn) navigateFn(e as MouseEvent)
}

const baseItemClass = 'w-full flex transition duration-150 ease-in-out'

// Color: prop > color resuelto de la lista contenedora > default.
const resolvedColor = computed<KunColor>(() => props.color ?? (listContext?.color as KunColor | undefined) ?? 'primary')
// La matriz KunColor x KunVariant provee TODAS las clases literales
// (texto + fondo + ring + estados); nunca se construyen con template.
const variantClass = computed(() => kunVariantClasses(resolvedColor.value, props.variant))
const densityClass = computed(() => {
  switch (props.density) {
    case 'comfortable': return 'py-2'
    case 'compact': return 'py-1'
    default: return 'py-3'
  }
})
const roundedClass = computed(() => {
  if (props.tile) return 'rounded-none'
  if (props.rounded === true) return 'rounded-md'
  return ''
})
const rippleClass = computed(() => props.ripple ? 'relative overflow-hidden' : '')
const isActiveState = computed(() => isItemSelected.value || isActive.value)
// Estado activo/seleccionado lleva `!` para ganarle al bg de la variante
// (todas son literales; el orden del CSS generado no decide el estado).
const stateClass = computed(() => (isActiveState.value ? kunSelectedClasses(resolvedColor.value) : ''))
// Hover de seleccion con color del item (solo si no hay estado activo).
const hoverClass = computed(() =>
  (props.selectable && !props.disabled && !isActiveState.value) ? kunHoverClasses(resolvedColor.value) : ''
)

const mergedItemClass = computed(() => {
  return [
    baseItemClass,
    variantClass.value,
    densityClass.value,
    roundedClass.value,
    rippleClass.value,
    props.itemPosition,
    stateClass.value,
    hoverClass.value,
    {
      'cursor-not-allowed opacity-50': props.disabled,
      'cursor-pointer': props.selectable && !props.disabled,
      'px-4': !props.noGutters,
    },
    props.containerClass,
  ]
})
</script>

