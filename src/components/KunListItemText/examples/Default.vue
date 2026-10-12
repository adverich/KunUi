<script setup lang="ts">
import { ref } from 'vue'
import KunListItemText from '../src/components/KunListItemText.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

const text = ref('Texto del ítem')
const fontSize = ref('text-sm')
const textColor = ref('text-ui-muted')
const fontWeight = ref('font-medium')
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunListItemText</h2>

      <p class="text-xs uppercase tracking-wide text-ui-muted">Vía prop</p>
      <KunListItemText
        :text="text || null"
        :font-size="fontSize"
        :text-color="textColor"
        :font-weight="fontWeight"
      />

      <p class="text-xs uppercase tracking-wide text-ui-muted">Vía slot</p>
      <KunListItemText
        :font-size="fontSize"
        :text-color="textColor"
        :font-weight="fontWeight"
      >
        {{ text }}
      </KunListItemText>
    </div>

    <!-- Panel de configuración (scroll propio) -->
    <div class="space-y-4 rounded-xl border border-ui p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-ui-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunTextField v-model="text" label="Text" density="compact" />
        <KunTextField v-model="fontSize" label="Font size" density="compact" />
        <KunTextField v-model="textColor" label="Text color" density="compact" />
        <KunTextField v-model="fontWeight" label="Font weight" density="compact" />
      </div>
    </div>
  </div>
</template>
