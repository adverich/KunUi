<!-- theme-exempt: demo (KunClock.color acepta cualquier valor CSS; el HEX es dato de demo) -->
<script setup lang="ts">
import { ref } from 'vue'
import KunClock from '../src/components/KunClock.vue'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// Controles del playground (color/size son estilos inline; format
// está reservado sin efecto).
// ------------------------------------------------------------------
const show = ref(true)
const color = ref('#ff0000')
const size = ref('1.5rem')
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunClock</h2>

      <div class="rounded-lg bg-muted p-3 text-sm">
        <p class="text-muted text-xs">El reloj flota fijo arriba a la derecha del viewport (miralo ahí ☝).</p>
      </div>

      <KunClock v-if="show" :color="color" :size="size" />
    </div>

    <!-- Panel de configuración (scroll propio: no arrastra la vista previa) -->
    <div class="space-y-4 rounded-lg border border-default p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunSwitch v-model="show" label="Mostrar" />
        <KunTextField v-model="color" label="Color (CSS)" density="compact" />
        <KunTextField v-model="size" label="Size (CSS)" density="compact" />
      </div>
    </div>
  </div>
</template>
