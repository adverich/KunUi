<script setup lang="ts">
import { ref } from 'vue'
import KunListSubheader from '../src/components/KunListSubheader.vue'
import KunListItem from '../../KunListItem/src/components/KunListItem.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// Controles del playground
// ------------------------------------------------------------------
const text = ref('Usuarios')
const fontSize = ref('text-xs')
const fontWeight = ref('font-semibold')
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunListSubheader</h2>

      <ul class="space-y-1 rounded-lg bg-muted p-2">
        <KunListSubheader
          :text="text"
          :font-size="fontSize"
          :font-weight="fontWeight"
        />
        <KunListItem value="ada">Ada Lovelace</KunListItem>
        <KunListItem value="grace">Grace Hopper</KunListItem>
        <KunListSubheader text="Configuración" />
        <KunListItem value="perfil">Perfil</KunListItem>
        <KunListItem value="notificaciones">Notificaciones</KunListItem>
      </ul>
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
