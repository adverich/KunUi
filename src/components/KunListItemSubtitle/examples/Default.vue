<script setup lang="ts">
import { ref } from 'vue'
import KunListItemSubtitle from '../src/components/KunListItemSubtitle.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

const text = ref('Subtítulo del ítem')
const fontSize = ref('text-xs')
const fontWeight = ref('font-medium')
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunListItemSubtitle</h2>

      <p class="text-xs uppercase tracking-wide text-muted">Vía prop</p>
      <KunListItemSubtitle
        :text="text || null"
        :font-size="fontSize"
        :font-weight="fontWeight"
      />

      <p class="text-xs uppercase tracking-wide text-muted">Vía slot</p>
      <KunListItemSubtitle
        :font-size="fontSize"
        :font-weight="fontWeight"
      >
        {{ text }}
      </KunListItemSubtitle>
    </div>

    <!-- Panel de configuración (scroll propio) -->
    <div class="space-y-4 rounded-lg border border-default p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunTextField v-model="text" label="Text" density="compact" />
        <KunTextField v-model="fontSize" label="Font size" density="compact" />
        <KunTextField v-model="fontWeight" label="Font weight" density="compact" />
      </div>
    </div>
  </div>
</template>
