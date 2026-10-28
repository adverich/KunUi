<template>
  <RouterLink
    v-if="props.to"
    :to="(to as any)"
    :replace="replace"
    custom
    v-slot="{ navigate, href }"
  >
    <a
      :href="href"
      :class="cardClass"
      role="link"
      tabindex="0"
      @click="e => handleClick(e, navigate)"
      @keydown.enter.prevent="e => handleClick(e, navigate)"
      v-bind="$attrs"
    >
      <template v-if="image || $slots.image">
        <slot name="image">
          <img :src="image || undefined" class="w-full h-auto object-cover" />
        </slot>
      </template>

      <div v-if="prependAvatar || prependIcon || $slots.prepend" class="flex items-center gap-2">
        <slot name="prepend" />
        <img v-if="prependAvatar" :src="prependAvatar" class="w-8 h-8 rounded-full" />
        <i v-if="prependIcon" :class="prependIcon" />
      </div>

      <div v-if="$slots.title || title || subtitle" class="pt-2">
        <KunCardItem :dense="density !== 'default'">
          <KunCardTitle :title="title" :subtitle="subtitle" :titleSize="titleSize" />
        </KunCardItem>
      </div>

      <div
        v-if="$slots.default || text"
        :class="[ 'text-sm', scrollable ? 'flex-grow overflow-auto' : '' ]"
      >
        <KunCardItem v-if="text">
          <KunCardText :text="text" />
        </KunCardItem>
        <slot v-else />
      </div>

      <div v-if="appendAvatar || appendIcon || $slots.append" class="flex items-center gap-2">
        <slot name="append" />
        <img v-if="appendAvatar" :src="appendAvatar" class="w-8 h-8 rounded-full" />
        <i v-if="appendIcon" :class="appendIcon" />
      </div>

      <div v-if="$slots.actions" class="flex justify-end gap-2">
        <KunCardActions>
          <slot name="actions" />
        </KunCardActions>
      </div>

      <div v-if="loading" class="absolute bottom-0 left-0 w-full h-1 bg-primary animate-pulse"></div>
    </a>
  </RouterLink>

  <component
    v-else
    :is="props.href && !props.to ? 'a' : tag"
    :href="props.href && !props.to ? props.href : undefined"
    :class="cardClass"
    v-bind="$attrs"
  >
    <template v-if="image || $slots.image">
      <slot name="image">
        <img :src="image || undefined" class="w-full h-auto object-cover" />
      </slot>
    </template>

    <div v-if="prependAvatar || prependIcon || $slots.prepend" class="flex items-center gap-2">
      <slot name="prepend" />
      <img v-if="prependAvatar" :src="prependAvatar" class="w-8 h-8 rounded-full" />
      <i v-if="prependIcon" :class="prependIcon" />
    </div>

    <div v-if="$slots.title || title || subtitle">
      <KunCardItem :dense="density !== 'default'">
        <KunCardTitle :title="title" :subtitle="subtitle" :titleSize="titleSize" />
      </KunCardItem>
    </div>

    <div
      v-if="$slots.default || text"
      :class="[ 'text-sm', scrollable ? 'flex-grow overflow-auto' : '' ]"
    >
      <KunCardItem v-if="text">
        <KunCardText :text="text" />
      </KunCardItem>
      <slot v-else />
    </div>

    <div v-if="appendAvatar || appendIcon || $slots.append" class="flex items-center gap-2">
      <slot name="append" />
      <img v-if="appendAvatar" :src="appendAvatar" class="w-8 h-8 rounded-full" />
      <i v-if="appendIcon" :class="appendIcon" />
    </div>

    <div v-if="$slots.actions" class="flex justify-end gap-2">
      <KunCardActions>
        <slot name="actions" />
      </KunCardActions>
    </div>

    <div v-if="loading" class="absolute bottom-0 left-0 w-full h-1 bg-primary animate-pulse"></div>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { kunCardProps } from '../composables/kunCardProps.js'
import { KUN_SURFACE_BG, resolveKunColor, resolveKunVariant, type KunColor, type KunVariant } from '../../../../theme/kunVariants.js'

import KunCardItem from '../../../KunCardItem/src/components/KunCardItem.vue'
import KunCardTitle from '../../../KunCardTitle/src/components/KunCardTitle.vue'
import KunCardText from '../../../KunCardText/src/components/KunCardText.vue'
import KunCardActions from '../../../KunCardActions/src/components/KunCardActions.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps(kunCardProps)

const isLink = computed(() => !!(props.to || props.href))
const tag = computed(() => props.tag || 'div')

function handleClick(e: MouseEvent | KeyboardEvent, navigate?: () => void): void {
  if (e instanceof MouseEvent && (e.ctrlKey || e.metaKey || e.button === 1)) return
  e.preventDefault()
  navigate?.()
}

// ------------------------------------------------------------------
// Color/variante estándar: prop > theme.defaults.card > (neutral, solid).
// Superficie vía `KUN_SURFACE_BG` (fondo + ring, literales). El caso
// especial `solid` × `neutral` conserva la superficie de página
// `bg-default` (el `bg-inverted` de la matriz es para controles).
// ------------------------------------------------------------------
const resolvedColor = computed<KunColor>(() => resolveKunColor(props.color, 'card'))
const resolvedVariant = computed<KunVariant>(() => resolveKunVariant(props.variant, 'card'))
const isNeutralSolid = computed(() => resolvedColor.value === 'neutral' && resolvedVariant.value === 'solid')
const surfaceClass = computed(() =>
  isNeutralSolid.value ? 'bg-default' : KUN_SURFACE_BG[resolvedColor.value][resolvedVariant.value],
)
const textColor = computed(() =>
  (resolvedVariant.value === 'solid' && !isNeutralSolid.value) ? 'text-highlighted' : 'text-default',
)
// La sombra es propia de la variante plena (replica el antiguo `elevated`).
// Sin sombra se logra con `elevation="0"`; el borde es `variant="outline"`.
const shadowClass = computed(() => {
  if (resolvedVariant.value !== 'solid') return 'shadow-none'
  return `shadow-${props.elevation}`
})

const cardClass = computed(() => {
  const base = [
    'relative',
    'overflow-hidden',
    'flex',
    'flex-col',
    'w-full',
    isLink.value ? 'cursor-pointer' : '',
    props.scrollable ? 'h-full' : '',
    surfaceClass.value,
    textColor.value,
    props.disabled ? 'pointer-events-none opacity-50' : '',
    props.tile ? '' : props.rounded === true ? 'rounded-lg' : props.rounded ? `rounded-${props.rounded}` : '',
    shadowClass.value,
    props.hover ? 'hover:shadow-md transition-shadow' : '',
    props.height ? `h-[${props.height}]` : '',
    props.width ? `w-[${props.width}]` : '',
    props.maxHeight ? `max-h-[${props.maxHeight}]` : '',
    props.maxWidth ? `max-w-[${props.maxWidth}]` : '',
    props.minHeight ? `min-h-[${props.minHeight}]` : '',
    props.minWidth ? `min-w-[${props.minWidth}]` : '',
    props.position ? props.position : ''
  ]
  return base.filter(Boolean).join(' ')
})
</script>
