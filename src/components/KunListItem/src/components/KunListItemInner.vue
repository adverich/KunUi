<template>
  <!-- CONTENIDO (bloque único: lo usan la rama link y la rama simple) -->
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
    <div class="flex flex-col min-w-0 flex-1" :class="contentClass" v-bind="otherAttrs">
      <slot>
        <slot name="title">
          <div v-if="title" class="truncate" :class="titleClass">{{ title }}</div>
        </slot>
        <slot name="subtitle">
          <div v-if="subtitle" class="truncate" :class="subtitleClass">
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
        <KunIcon v-else-if="typeof appendIcon === 'string'" :icon="appendIcon" :class="appendClass" />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import KunIcon from '../../../KunIcon/src/components/KunIcon.vue';

/**
 * Contenido interior de KunListItem (subcomponente interno, no público).
 * Existe para no duplicar el bloque prepend/contenido/append entre la rama
 * link (`to`) y la rama simple. Los slots se reenvían desde KunListItem.
 */
const props = defineProps({
  /** Ícono al inicio (string, componente o slot `prepend`). */
  prependIcon: [String, Object, Function],
  /** Avatar al inicio (URL de imagen). */
  prependAvatar: String,
  /** Clase del contenedor del prepend. */
  prependClass: String,
  /** Ícono al final (string, componente o slot `append`). */
  appendIcon: [String, Object, Function],
  /** Avatar al final (URL de imagen). */
  appendAvatar: String,
  /** Clase del contenedor del append. */
  appendClass: String,
  /** Título (alternativa al slot). */
  title: [String, Number, Boolean],
  /** Clase del título. */
  titleClass: String,
  /** Subtítulo (alternativa al slot). */
  subtitle: [String, Number, Boolean],
  /** Clase del subtítulo. */
  subtitleClass: String,
  /** Clase extra del contenido central (heredada de `$attrs.class`). */
  contentClass: [String, Array, Object],
  /** Resto de `$attrs` (sin `class`) para el contenido central. */
  otherAttrs: Object,
});

const isComponent = (val: unknown): boolean => typeof val === 'object' || typeof val === 'function';
const hasPrepend = computed(() => !!(props.prependIcon || props.prependAvatar));
const hasAppend = computed(() => !!(props.appendIcon || props.appendAvatar));
</script>
