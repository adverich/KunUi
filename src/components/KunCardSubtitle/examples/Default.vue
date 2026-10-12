<script setup lang="ts">
import { ref } from 'vue'
import KunCardSubtitle from '../src/components/KunCardSubtitle.vue'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

const subtitle = ref('Subtítulo de la tarjeta')
const color = ref('text-ui-muted')
const fontWeight = ref('font-normal')
const dense = ref(false)
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunCardSubtitle</h2>

      <p class="text-xs uppercase tracking-wide text-ui-muted">Vía prop</p>
      <KunCardSubtitle
        :subtitle="subtitle || null"
        :dense="dense"
        :color="color"
        :font-weight="fontWeight"
      />

      <p class="text-xs uppercase tracking-wide text-ui-muted">Vía slot</p>
      <KunCardSubtitle
        :dense="dense"
        :color="color"
        :font-weight="fontWeight"
      >
        {{ subtitle }}
      </KunCardSubtitle>
    </div>

    <!-- Panel de configuración (scroll propio) -->
    <div class="space-y-4 rounded-xl border border-ui p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-ui-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunTextField v-model="subtitle" label="Subtitle" density="compact" />
        <KunTextField v-model="color" label="Color" density="compact" />
        <KunTextField v-model="fontWeight" label="Font weight" density="compact" />
        <KunSwitch v-model="dense" label="Dense" />
      </div>
    </div>
  </div>
</template>
