<template>
  <RouterLink
    v-if="isLink"
    :to="props.to"
    :replace="props.replace"
    :custom="true"
    v-slot="{ href, navigate }"
    role="link"
    tabindex="0"
  >
    <component
      :is="'a'"
      :href="href"
      :class="cardClass"
      v-bind="$attrs"
      @click="e => {
        if (e.ctrlKey || e.metaKey || e.button === 1) return
        navigate(e)
      }"
      @keydown.enter.prevent="e => {
        if (e.ctrlKey || e.metaKey || e.button === 1) return
        navigate(e)
      }"
    >
      <!-- Header -->
      <div v-if="$slots.title || title || subtitle">
        <KunCardItem dense>
          <KunCardTitle :title="title" :subtitle="subtitle" :titleSize="titleSize"/>
        </KunCardItem>
      </div>

      <!-- Contenido -->
      <div v-if="$slots.default || text">
        <KunCardItem v-if="text">
          <KunCardText :text="text" />
        </KunCardItem>
        <slot v-else />
      </div>

      <!-- Acciones -->
      <div v-if="$slots.actions">
        <KunCardActions>
          <slot name="actions" />
        </KunCardActions>
      </div>
    </component>
  </RouterLink>

  <component
    v-else
    :is="'div'"
    :class="cardClass"
    v-bind="$attrs"
  >
    <div v-if="$slots.title || title || subtitle">
      <KunCardItem dense>
        <KunCardTitle :title="title" :subtitle="subtitle" :titleSize="titleSize"/>
      </KunCardItem>
    </div>

    <div v-if="$slots.default || text">
      <KunCardItem v-if="text">
        <KunCardText :text="text" />
      </KunCardItem>
      <slot v-else />
    </div>

    <div v-if="$slots.actions">
      <KunCardActions>
        <slot name="actions" />
      </KunCardActions>
    </div>
  </component>


</template>

<script setup>
import { computed } from 'vue'
import { kunCardProps } from '../composables/kunCardProps'

import KunCardItem from '../../../KunCardItem/src/components/KunCardItem.vue'
import KunCardTitle from '../../../KunCardTitle/src/components/KunCardTitle.vue'
import KunCardText from '../../../KunCardText/src/components/KunCardText.vue'
import KunCardActions from '../../../KunCardActions/src/components/KunCardActions.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps(kunCardProps)

const isLink = computed(() => !!(props.to || props.href));

const cardClass = computed(() => {
  return [
    'w-full',
    props.bgColor,
    props.textColor || 'text-black',
    props.outlined ? `border ${props.outlineColor}` : '',
    props.rounded === true ? 'rounded-lg' : props.rounded ? `rounded-${props.rounded}` : '',
    props.flat ? 'shadow-none' : `shadow-${props.elevation}`,
    isLink.value ? 'cursor-pointer' : ''
  ].filter(Boolean).join(' ')
})
</script>
