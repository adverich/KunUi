<script setup lang="ts">
import { ref } from 'vue'
import KunSpacer from '../src/components/KunSpacer.vue'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'

// KunSpacer no tiene props: estos controles solo afectan la demo
const guides = ref(true)
const vertical = ref(false)
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunSpacer</h2>

      <div :class="['flex gap-2 rounded-xl border border-ui p-3', vertical ? 'flex-col h-56' : 'flex-row items-center']">
        <div class="rounded bg-primary px-4 py-2 text-sm font-medium text-white">A</div>
        <KunSpacer :class="guides ? 'rounded border border-dashed border-primary bg-primary/10' : ''" />
        <div class="rounded bg-success px-4 py-2 text-sm font-medium text-white">B</div>
      </div>

      <p class="text-xs text-ui-muted">
        El spacer (flex-grow) empuja A y B a los extremos ocupando todo el espacio intermedio.
      </p>
    </div>

    <!-- Panel de configuración (scroll propio) -->
    <div class="space-y-4 rounded-xl border border-ui p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-ui-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunSwitch v-model="guides" label="Resaltar spacer" />
        <KunSwitch v-model="vertical" label="Columna (flex-col)" />

        <p class="col-span-2 text-xs text-ui-muted">
          KunSpacer no tiene props: es un div con flex-grow pensado para usarse dentro de un flex row/col.
        </p>
      </div>
    </div>
  </div>
</template>
