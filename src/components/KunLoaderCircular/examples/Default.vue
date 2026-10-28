<script setup lang="ts">
import { ref, computed } from 'vue'
import KunLoaderCircular from '../src/components/KunLoaderCircular.vue'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// Controles del playground
// ------------------------------------------------------------------
const fullscreen = ref(false)

const sizeRaw = ref('48')
const widthRaw = ref('5')
const sizeProp = computed(() => (sizeRaw.value === '' ? 24 : Number(sizeRaw.value)))
const widthProp = computed(() => (widthRaw.value === '' ? 4 : Number(widthRaw.value)))

const gradient = ref('conic-gradient(from 0deg, var(--kun-bg-elevated), var(--kun-primary))')
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunLoaderCircular</h2>

      <div class="flex min-h-40 items-center justify-center rounded-lg bg-muted p-6">
        <KunLoaderCircular
          :fullscreen="fullscreen"
          :size="sizeProp"
          :width="widthProp"
          :gradient="gradient"
        />
      </div>
      <p v-if="fullscreen" class="text-sm text-muted">
        El overlay de pantalla completa está activo (teleport a body). Desactivalo con el switch.
      </p>
    </div>

    <!-- Panel de configuración (scroll propio) -->
    <div class="space-y-4 rounded-lg border border-default p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunSwitch v-model="fullscreen" label="Fullscreen" />
        <KunTextField v-model="sizeRaw" label="Size px (vacío = 24)" density="compact" inputmode="decimal" />
        <KunTextField v-model="widthRaw" label="Width px (vacío = 4)" density="compact" inputmode="decimal" />
        <KunTextField v-model="gradient" label="Gradient" density="compact" class="col-span-2" />
      </div>
    </div>
  </div>
</template>
