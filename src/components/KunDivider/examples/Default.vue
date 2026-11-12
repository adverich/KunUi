<script setup lang="ts">
import { ref, computed } from 'vue'
import KunDivider from '../src/components/KunDivider.vue'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// ------------------------------------------------------------------
// Controles del playground
// ------------------------------------------------------------------
const vertical = ref(false)
const inset = ref(false)
const dashed = ref(false)

const lengthRaw = ref('')
const lengthProp = computed(() => {
  const v = lengthRaw.value.trim()
  if (!v) return undefined
  const n = Number(v)
  return Number.isNaN(n) ? v : n
})

const color = ref('text-muted')
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunDivider</h2>

      <div class="rounded-lg bg-muted p-4">
        <p class="text-sm">Contenido superior</p>
        <KunDivider
          :vertical="vertical"
          :inset="inset"
          :dashed="dashed"
          :length="lengthProp"
          :color="color || undefined"
          class="my-3"
        />
        <p class="text-sm">Contenido inferior</p>
      </div>

      <div class="space-y-3 rounded-lg bg-muted p-4">
        <p class="text-xs font-semibold uppercase tracking-wide text-muted">Más ejemplos</p>
        <KunDivider color="text-muted" />
        <KunDivider dashed color="text-primary" />
        <KunDivider inset color="text-success" />
        <KunDivider :length="120" color="text-warning" />
        <div class="flex h-12 items-center gap-3">
          <span class="text-sm">Izquierda</span>
          <KunDivider vertical color="text-muted" />
          <span class="text-sm">Derecha</span>
        </div>
      </div>
    </div>

    <!-- Panel de configuración (scroll propio) -->
    <div class="space-y-4 rounded-lg border border-default p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunSwitch v-model="vertical" label="Vertical" />
        <KunSwitch v-model="inset" label="Inset" />
        <KunSwitch v-model="dashed" label="Dashed" />
        <KunTextField v-model="lengthRaw" label="Length (vacío = 100%)" density="compact" />
        <KunTextField v-model="color" label="Color" density="compact" class="col-span-2" />
      </div>
    </div>
  </div>
</template>
