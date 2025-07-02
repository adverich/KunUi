<template>
  <RouterLink
    v-if="isLink"
    :to="to"
    :replace="replace"
    :custom="true"
    v-slot="{ href, navigate, isActive: linkActive }"
  >
    <component
      :is="tag"
      ref="liRef"
      :href="href"
      role="option"
      :aria-selected="isItemSelected || isActive || linkActive"
      :aria-disabled="disabled"
      tabindex="-1"
      :class="mergedItemClass"
      @click="e => handleClick(e, navigate)"
      @keydown.enter.prevent="e => handleClick(e, navigate)"
      v-bind="$attrs"
    >
      <!-- CONTENIDO -->
      <div class="flex w-full items-center">
        <!-- Prepend -->
        <div v-if="hasPrepend || $slots.prepend" class="shrink-0 flex items-center gap-2 me-2">
          <slot name="prepend">
            <img v-if="prependAvatar" :src="prependAvatar" class="rounded-full" :class="prependClass" />

            <!-- Permitir componente personalizado -->
            <component
              v-else-if="isComponent(prependIcon)"
              :is="prependIcon"
              :class="prependClass"
            />
            
            <!-- Si es string, lo pasás a KunIcon -->
            <KunIcon
              v-else-if="typeof prependIcon === 'string'"
              :icon="prependIcon"
              :class="prependClass"
            />
          </slot>
        </div>

        <!-- Contenido central -->
        <div class="flex flex-col min-w-0 flex-1">
          <slot>
            <slot name="title">
              <div v-if="title" class="font-medium truncate">{{ title }}</div>
            </slot>
            <slot name="subtitle">
              <div v-if="subtitle" class="text-sm text-gray-500 dark:text-gray-400 truncate">
                {{ subtitle }}
              </div>
            </slot>
          </slot>
        </div>

        <!-- Append -->
        <div v-if="hasAppend" class="shrink-0 flex items-center gap-2 ms-3">
          <slot name="append">
            <img v-if="appendAvatar" :src="appendAvatar" class="w-8 h-8 rounded-full" />
            <component v-if="isComponent(appendIcon)" :is="appendIcon" class="w-5 h-5" />
            <i v-else-if="appendIcon" :class="appendClass" class="text-xl leading-none" />
          </slot>
        </div>
      </div>
    </component>
  </RouterLink>

  <component
    v-else
    :is="tag"
    ref="liRef"
    role="option"
    :aria-selected="isItemSelected || isActive"
    :aria-disabled="disabled"
    tabindex="-1"
    :class="mergedItemClass"
    @click="handleClick"
    @keydown.enter.prevent="handleClick"
    v-bind="$attrs"
  >
    <!-- CONTENIDO -->
    <div class="flex w-full items-center">
      <!-- Prepend -->
        <div v-if="hasPrepend || $slots.prepend" class="shrink-0 flex items-center gap-2 me-2">
          <slot name="prepend">
            <img v-if="prependAvatar" :src="prependAvatar" class="rounded-full" :class="prependClass" />

            <!-- Permitir componente personalizado -->
            <component
              v-else-if="isComponent(prependIcon)"
              :is="prependIcon"
              :class="prependClass"
            />
            
            <!-- Si es string, lo pasás a KunIcon -->
            <KunIcon
              v-else-if="typeof prependIcon === 'string'"
              :icon="prependIcon"
              :class="prependClass"
            />
          </slot>
        </div>

      <!-- Contenido central -->
      <div class="flex flex-col min-w-0 flex-1">
        <slot>
          <slot name="title">
            <div v-if="title" class="font-medium truncate">{{ title }}</div>
          </slot>
          <slot name="subtitle">
            <div v-if="subtitle" class="text-sm text-gray-500 dark:text-gray-400 truncate">
              {{ subtitle }}
            </div>
          </slot>
        </slot>
      </div>

      <!-- Append -->
      <div v-if="hasAppend" class="shrink-0 flex items-center gap-2 ms-3">
        <slot name="append">
          <img v-if="appendAvatar" :src="appendAvatar" class="w-8 h-8 rounded-full" />
          <component v-if="isComponent(appendIcon)" :is="appendIcon" class="w-5 h-5" />
          <i v-else-if="appendIcon" :class="appendIcon" class="text-xl leading-none" />
        </slot>
      </div>
    </div>
  </component>
</template>

<script setup>
import { ref, inject, onMounted, onBeforeUnmount, computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  value: [String, Number, Boolean, Object, Array, null],
  to: [String, Object],
  href: String,
  replace: Boolean,
  exact: Boolean,
  tag: { type: String, default: 'li' },

  disabled: Boolean,
  active: Boolean,
  activeClass: {
    type: String,
    default: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
  },
  selectable: { type: Boolean, default: false },

  variant: { type: String, default: 'text' },
  density: { type: String, default: 'default' },
  rounded: { type: [Boolean, String], default: true },
  tile: Boolean,
  ripple: { type: [Boolean, Object], default: true },

  bgItems: { type: String, default: 'bg-transparent' },
  textColor: { type: String, default: 'text-black dark:text-white' },
  hoverBg: { type: String, default: 'hover:bg-gray-100 dark:hover:bg-gray-600' },
  noGutters: Boolean,
  itemPosition: { type: String, default: 'items-start' },
  itemClass: String,

  prependIcon: [String, Object, Function],
  prependAvatar: String,
  prependClass: String,
  appendIcon: [String, Object, Function],
  appendAvatar: String,
  appendClass: String,
  title: [String, Number, Boolean],
  subtitle: [String, Number, Boolean],
})

const emits = defineEmits(['click'])

const liRef = ref(null)
const registerRef = inject('registerListItemRef', null)
const listContext = inject('kunListContext', null)

onMounted(() => {
  if (registerRef && liRef.value) registerRef(liRef.value)
})
onBeforeUnmount(() => {
  if (registerRef) registerRef(null)
})

const isComponent = val => typeof val === 'object' || typeof val === 'function';
const hasPrepend = computed(() => !!(props.prependIcon || props.prependAvatar));
const hasAppend = computed(() => !!(props.appendIcon || props.appendAvatar));
const isItemSelected = computed(() => listContext?.isSelected?.(props.value) ?? false);
const isActive = computed(() => props.active);
const isLink = computed(() => !!props.to);

function handleClick(e, navigateFn = null) {
  if (props.disabled) return
  emits('click', e)

  const el = liRef.value?.$el ?? liRef.value
  if (el?.dispatchEvent) {
    el.dispatchEvent(new CustomEvent('select', { detail: props.value, bubbles: true }))
  }

if (listContext && props.selectable && props.value !== null) {
    listContext.toggleItem?.(props.value)
    if (el?.dispatchEvent) {
      el.dispatchEvent(new CustomEvent('selected', { detail: props.value, bubbles: true }))
    }
  }

  if (navigateFn) navigateFn(e)
}

const baseItemClass = 'w-full flex transition duration-150 ease-in-out'
const variantClass = computed(() => {
  switch (props.variant) {
    case 'outlined': return 'border border-gray-300 dark:border-gray-700'
    case 'elevated': return 'shadow-md'
    case 'tonal': return 'bg-gray-100 dark:bg-gray-800'
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

const mergedItemClass = computed(() => [
  baseItemClass,
  variantClass.value,
  densityClass.value,
  roundedClass.value,
  rippleClass.value,
  props.bgItems,
  props.textColor,
  props.itemPosition,
  {
    'cursor-not-allowed opacity-50': props.disabled,
    [`cursor-pointer ${props.hoverBg}`]: props.selectable && !props.disabled,
    [props.activeClass]: isItemSelected.value || isActive.value,
    'px-4': !props.noGutters,
  },
  props.itemClass,
])
</script>
