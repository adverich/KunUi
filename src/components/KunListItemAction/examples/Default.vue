<script setup lang="ts">
import { ref } from 'vue'
import KunListItemAction from '../src/components/KunListItemAction.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

const text = ref('Acción del ítem')
const textColor = ref('text-ui')
const fontSize = ref('text-sm')
const fontWeight = ref('font-medium')
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunListItemAction</h2>

      <p class="text-xs uppercase tracking-wide text-ui-muted">Vía prop</p>
      <KunListItemAction
        :text="text || null"
        :text-color="textColor"
        :font-size="fontSize"
        :font-weight="fontWeight"
      />

      <p class="text-xs uppercase tracking-wide text-ui-muted">Vía slot</p>
      <KunListItemAction
        :text-color="textColor"
        :font-size="fontSize"
        :font-weight="fontWeight"
      >
        {{ text }}
      </KunListItemAction>
    </div>

    <!-- Panel de configuración (scroll propio) -->
    <div class="space-y-4 rounded-xl border border-ui p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-ui-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunTextField v-model="text" label="Text" density="compact" />
        <KunTextField v-model="textColor" label="Text color" density="compact" />
        <KunTextField v-model="fontSize" label="Font size" density="compact" />
        <KunTextField v-model="fontWeight" label="Font weight" density="compact" />
      </div>
    </div>
  </div>
</template>
