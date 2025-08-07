<template>
  <RouterLink
    v-if="isLink"
    :to="to"
    :replace="replace"
    :exact="exact"
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
          <img :src="image" class="w-full h-auto object-cover" />
        </slot>
      </template>

      <div v-if="prependAvatar || prependIcon || $slots.prepend" class="flex items-center gap-2 px-4 py-2">
        <slot name="prepend" />
        <img v-if="prependAvatar" :src="prependAvatar" class="w-8 h-8 rounded-full" />
        <i v-if="prependIcon" :class="prependIcon" />
      </div>

      <div v-if="$slots.title || title || subtitle" class="px-4 pt-4">
        <KunCardItem :dense="density !== 'default'">
          <KunCardTitle :title="title" :subtitle="subtitle" :titleSize="titleSize" />
        </KunCardItem>
      </div>

      <div
        v-if="$slots.default || text"
        :class="[ 'px-4 py-2 text-sm', scrollable ? 'flex-grow overflow-auto' : '' ]"
      >
        <KunCardItem v-if="text">
          <KunCardText :text="text" />
        </KunCardItem>
        <slot v-else />
      </div>

      <div v-if="appendAvatar || appendIcon || $slots.append" class="flex items-center gap-2 px-4 py-2">
        <slot name="append" />
        <img v-if="appendAvatar" :src="appendAvatar" class="w-8 h-8 rounded-full" />
        <i v-if="appendIcon" :class="appendIcon" />
      </div>

      <div v-if="$slots.actions" class="px-4 pb-4 flex justify-end gap-2">
        <KunCardActions>
          <slot name="actions" />
        </KunCardActions>
      </div>

      <div v-if="loading" class="absolute bottom-0 left-0 w-full h-1 bg-primary animate-pulse"></div>
    </a>
  </RouterLink>

  <component
    v-else
    :is="tag"
    :class="cardClass"
    v-bind="$attrs"
  >
    <template v-if="image || $slots.image">
      <slot name="image">
        <img :src="image" class="w-full h-auto object-cover" />
      </slot>
    </template>

    <div v-if="prependAvatar || prependIcon || $slots.prepend" class="flex items-center gap-2 px-4 py-2">
      <slot name="prepend" />
      <img v-if="prependAvatar" :src="prependAvatar" class="w-8 h-8 rounded-full" />
      <i v-if="prependIcon" :class="prependIcon" />
    </div>

    <div v-if="$slots.title || title || subtitle" class="px-4 pt-4">
      <KunCardItem :dense="density !== 'default'">
        <KunCardTitle :title="title" :subtitle="subtitle" :titleSize="titleSize" />
      </KunCardItem>
    </div>

    <div
      v-if="$slots.default || text"
      :class="[ 'px-4 py-2 text-sm', scrollable ? 'flex-grow overflow-auto' : '' ]"
    >
      <KunCardItem v-if="text">
        <KunCardText :text="text" />
      </KunCardItem>
      <slot v-else />
    </div>

    <div v-if="appendAvatar || appendIcon || $slots.append" class="flex items-center gap-2 px-4 py-2">
      <slot name="append" />
      <img v-if="appendAvatar" :src="appendAvatar" class="w-8 h-8 rounded-full" />
      <i v-if="appendIcon" :class="appendIcon" />
    </div>

    <div v-if="$slots.actions" class="px-4 pb-4 flex justify-end gap-2">
      <KunCardActions>
        <slot name="actions" />
      </KunCardActions>
    </div>

    <div v-if="loading" class="absolute bottom-0 left-0 w-full h-1 bg-primary animate-pulse"></div>
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { kunCardProps } from '../composables/kunCardProps'

import KunCardItem from '../../../KunCardItem/src/components/KunCardItem.vue'
import KunCardTitle from '../../../KunCardTitle/src/components/KunCardTitle.vue'
import KunCardText from '../../../KunCardText/src/components/KunCardText.vue'
import KunCardActions from '../../../KunCardActions/src/components/KunCardActions.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps(kunCardProps)

const isLink = computed(() => !!(props.to || props.href))
const tag = computed(() => props.tag || 'div')

function handleClick(e, navigate) {
  if (e.ctrlKey || e.metaKey || e.button === 1) return
  e.preventDefault()
  navigate?.()
}

const cardClass = computed(() => {
  const base = [
    'relative',
    'overflow-hidden',
    'flex',
    'flex-col',
    'w-full',
    isLink.value ? 'cursor-pointer' : '',
    props.scrollable ? 'h-full' : '',
    props.bgColor,
    props.textColor,
    props.disabled ? 'pointer-events-none opacity-50' : '',
    props.outlined ? `border ${props.outlineColor}` : '',
    props.tile ? '' : props.rounded === true ? 'rounded-lg' : props.rounded ? `rounded-${props.rounded}` : '',
    props.flat ? 'shadow-none' : `shadow-${props.elevation}`,
    props.hover ? 'hover:shadow-md transition-shadow' : '',
    props.height ? `h-[${props.height}]` : '',
    props.width ? `w-[${props.width}]` : '',
    props.maxHeight ? `max-h-[${props.maxHeight}]` : '',
    props.maxWidth ? `max-w-[${props.maxWidth}]` : '',
    props.minHeight ? `min-h-[${props.minHeight}]` : '',
    props.minWidth ? `min-w-[${props.minWidth}]` : '',
    props.position ? props.position : '',
    props.variant === 'outlined' ? 'border' : '',
    props.variant === 'flat' ? 'shadow-none' : '',
    props.variant === 'tonal' ? 'bg-gray-100 dark:bg-gray-800' : '',
    props.variant === 'text' ? 'bg-transparent shadow-none' : '',
    props.variant === 'plain' ? '' : ''
  ]
  return base.filter(Boolean).join(' ')
})
</script>
