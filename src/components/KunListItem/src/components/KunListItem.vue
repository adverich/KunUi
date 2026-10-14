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

interface KunListItemContext {
  toggleItem?: (value: unknown) => void;
  isSelected?: (value: unknown) => boolean;
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

const isItemSelected = computed(() => listContext?.isSelected?.(props.value) ?? false);
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

if (listContext && props.selectable && props.value !== null) {
    listContext.toggleItem?.(props.value)
    if (el?.dispatchEvent) {
      el.dispatchEvent(new CustomEvent('selected', { detail: props.value, bubbles: true }))
    }
  }

  if (navigateFn) navigateFn(e as MouseEvent)
}

const baseItemClass = 'w-full flex transition duration-150 ease-in-out'
const variantClass = computed(() => {
  switch (props.variant) {
    case 'outlined': return 'border border-ui'
    case 'elevated': return 'shadow-md'
    case 'tonal': return 'bg-surface'
    case 'flat': return 'bg-transparent'
    case 'plain': return ''
    default: return ''
  }
})
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
  if (props.rounded === false) return ''
  return `rounded-${props.rounded}`
})
const rippleClass = computed(() => props.ripple ? 'relative overflow-hidden' : '')

const mergedItemClass = computed(() => {
  return [
    baseItemClass,
    variantClass.value,
    densityClass.value,
    roundedClass.value,
    rippleClass.value,
    props.textColor,
    props.itemPosition,
    props.bgItems,
    {
      'cursor-not-allowed opacity-50': props.disabled,
      [`cursor-pointer ${props.hoverBg}`]: props.selectable && !props.disabled,
      [props.activeClass]: isItemSelected.value || isActive.value,
      'px-4': !props.noGutters,
    },
    props.containerClass,
  ]
})
</script>

