<script setup lang="ts">
import { ref, computed } from 'vue'
import KunListImg from '../src/components/KunListImg.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// Imagen autocontenida (sin dependencia de red)
// ------------------------------------------------------------------
const fallbackImg =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='200' height='200' fill='%233b82f6'/><text x='100' y='124' font-size='72' text-anchor='middle' fill='white'>AL</text></svg>"

// ------------------------------------------------------------------
// Controles del playground
// ------------------------------------------------------------------
const srcRaw = ref(fallbackImg)
const srcProp = computed(() => srcRaw.value || fallbackImg)

const alt = ref('Foto de Ada Lovelace')
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunListImg</h2>

      <ul class="space-y-2 rounded-lg bg-muted p-3">
        <li class="flex items-center gap-3">
          <KunListImg :src="srcProp" :alt="alt" class="h-12 w-12 shrink-0" />
          <div class="min-w-0">
            <p class="truncate font-medium">Ada Lovelace</p>
            <p class="truncate text-sm text-muted">Ingeniera de software</p>
          </div>
        </li>
        <li class="flex items-center gap-3">
          <KunListImg :src="srcProp" :alt="alt" class="h-8 w-8 shrink-0" />
          <span class="truncate text-sm">Vista compacta</span>
        </li>
      </ul>
    </div>

    <!-- Panel de configuración (scroll propio) -->
    <div class="space-y-4 rounded-lg border border-default p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunTextField v-model="srcRaw" label="Src (data-URI, vacío = demo)" density="compact" class="col-span-2" />
        <KunTextField v-model="alt" label="Alt" density="compact" />
      </div>
    </div>
  </div>
</template>
