<script setup lang="ts">
import { ref } from 'vue'
import KunListItemTitle from '../src/components/KunListItemTitle.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

const title = ref('Título del ítem')
const textColor = ref('text-ui')
const fontSize = ref('text-lg')
const fontWeight = ref('font-medium')
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunListItemTitle</h2>

      <p class="text-xs uppercase tracking-wide text-ui-muted">Vía prop</p>
      <KunListItemTitle
        :title="title || null"
        :text-color="textColor"
        :font-size="fontSize"
        :font-weight="fontWeight"
      />

      <p class="text-xs uppercase tracking-wide text-ui-muted">Vía slot</p>
      <KunListItemTitle
        :text-color="textColor"
        :font-size="fontSize"
        :font-weight="fontWeight"
      >
        {{ title }}
      </KunListItemTitle>
    </div>

    <!-- Panel de configuración (scroll propio) -->
    <div class="space-y-4 rounded-xl border border-ui p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-ui-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunTextField v-model="title" label="Title" density="compact" />
        <KunTextField v-model="textColor" label="Text color" density="compact" />
        <KunTextField v-model="fontSize" label="Font size" density="compact" />
        <KunTextField v-model="fontWeight" label="Font weight" density="compact" />
      </div>
    </div>
  </div>
</template>
