<script setup lang="ts">
import { ref, computed } from 'vue'
import KunAppbarTitle from '../src/components/KunAppbarTitle.vue'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// Variante demo (no es prop): texto vs. imagen
// ------------------------------------------------------------------
const variant = ref<'text' | 'image'>('text')
const variantOptions = ref([
  { id: 'text', name: 'text (solo título)' },
  { id: 'image', name: 'image (logo + v-else)' },
])

// ------------------------------------------------------------------
// Props efectivas
// ------------------------------------------------------------------
const title = ref('Mi aplicación')
const titleImageUrl = ref('https://picsum.photos/seed/kun-ui/64')
const titleImageProp = computed(() => (variant.value === 'image' ? titleImageUrl.value || undefined : undefined))
const titleImageSize = ref('h-6')
const textSize = ref('text-base')
const fontWeight = ref('font-medium')
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunAppbarTitle</h2>

      <div class="space-y-3 rounded-xl border border-ui bg-surface p-4">
        <div>
          <div class="text-ui-muted text-xs mb-1">Demo en vivo (variante: {{ variant }})</div>
          <KunAppbarTitle
            :title="title || undefined"
            :title-image="titleImageProp"
            :title-image-size="titleImageSize"
            :text-size="textSize"
            :font-weight="fontWeight"
          />
        </div>

        <div class="grid gap-3 border-t border-ui pt-3 sm:grid-cols-2">
          <div class="rounded-lg bg-field-background p-3">
            <div class="text-ui-muted text-xs mb-1">Variante texto</div>
            <KunAppbarTitle title="Solo texto" text-size="text-lg" font-weight="font-bold" />
          </div>
          <div class="rounded-lg bg-field-background p-3">
            <div class="text-ui-muted text-xs mb-1">Variante imagen</div>
            <KunAppbarTitle title="Con logo" :title-image="titleImageUrl || undefined" title-image-size="h-8" />
          </div>
        </div>
      </div>

      <p class="text-xs text-ui-muted">
        Nota: el componente usa <code>v-else</code>: si <code>titleImage</code> está presente se renderiza el
        <code>&lt;img&gt;</code> del logo y el texto de <code>title</code> se oculta.
      </p>

      <div class="rounded-lg bg-surface p-3 font-mono text-sm">
        <div class="text-ui-muted text-xs mb-1">props en crudo</div>
        <div>{{ JSON.stringify(title || null) }} · {{ JSON.stringify(titleImageProp ?? null) }} · {{ titleImageSize }} · {{ textSize }} · {{ fontWeight }}</div>
      </div>
    </div>

    <!-- Panel de configuración (scroll propio) -->
    <div class="space-y-4 rounded-xl border border-ui p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-ui-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunSelect
          v-model="variant"
          v-model:items="variantOptions"
          label="Variante demo"
          item-value="id"
          item-title="name"
          density="compact"
          class="col-span-2"
        />
        <KunTextField v-model="title" label="Title (vacío = sin título)" density="compact" />
        <KunTextField v-model="titleImageUrl" label="Title image URL" density="compact" :disabled="variant === 'text'" />
        <KunTextField v-model="titleImageSize" label="Title image size" density="compact" />
        <KunTextField v-model="textSize" label="Text size" density="compact" />
        <KunTextField v-model="fontWeight" label="Font weight" density="compact" />
      </div>
    </div>
  </div>
</template>
