<script setup lang="ts">
import { ref } from 'vue'
import KunCardText from '../src/components/KunCardText.vue'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

const text = ref('Contenido del cuerpo de la tarjeta.')
const color = ref('text-default')
const opacity = ref('opacity-100')
const tag = ref('div')
const dense = ref(false)
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunCardText</h2>

      <p class="text-xs uppercase tracking-wide text-muted">Vía prop</p>
      <KunCardText
        :text="text || null"
        :color="color"
        :dense="dense"
        :opacity="opacity"
        :tag="tag"
      />

      <p class="text-xs uppercase tracking-wide text-muted">Vía slot</p>
      <KunCardText
        :color="color"
        :dense="dense"
        :opacity="opacity"
        :tag="tag"
      >
        {{ text }}
      </KunCardText>
    </div>

    <!-- Panel de configuración (scroll propio) -->
    <div class="space-y-4 rounded-lg border border-default p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunTextField v-model="text" label="Text" density="compact" />
        <KunTextField v-model="color" label="Color" density="compact" />
        <KunTextField v-model="opacity" label="Opacity" density="compact" />
        <KunTextField v-model="tag" label="Tag" density="compact" />
        <KunSwitch v-model="dense" label="Dense" />
      </div>
    </div>
  </div>
</template>
