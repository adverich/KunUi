<script setup lang="ts">
import { ref } from 'vue'
import KunCol from '../src/components/KunCol.vue'
import KunRow from '../../KunRow/src/components/KunRow.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

// Spans por breakpoint (vacío = hereda el anterior; base vacía = fila completa)
const colsRaw = ref('6')
const smRaw = ref('')
const mdRaw = ref('')
const lgRaw = ref('')
const xlRaw = ref('')
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunCol</h2>

      <div class="rounded-xl border border-ui p-3">
        <KunRow>
          <KunCol
            :cols="colsRaw || undefined"
            :sm="smRaw || undefined"
            :md="mdRaw || undefined"
            :lg="lgRaw || undefined"
            :xl="xlRaw || undefined"
          >
            <div class="rounded border border-primary bg-primary/20 p-3 text-center text-sm font-medium">A (demo)</div>
          </KunCol>
          <KunCol :cols="6">
            <div class="rounded border border-ui bg-surface p-3 text-center text-sm text-ui-muted">B (fija, cols=6)</div>
          </KunCol>
        </KunRow>
      </div>

      <p class="font-mono text-xs text-ui-muted">
        cols={{ colsRaw || 'auto(12)' }} sm={{ smRaw || '↩' }} md={{ mdRaw || '↩' }} lg={{ lgRaw || '↩' }} xl={{ xlRaw || '↩' }}
      </p>
    </div>

    <!-- Panel de configuración (scroll propio) -->
    <div class="space-y-4 rounded-xl border border-ui p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-ui-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunTextField v-model="colsRaw" label="Cols (vacío = 12)" density="compact" inputmode="numeric" />
        <KunTextField v-model="smRaw" label="Sm ≥40rem (vacío = hereda)" density="compact" inputmode="numeric" />
        <KunTextField v-model="mdRaw" label="Md ≥48rem (vacío = hereda)" density="compact" inputmode="numeric" />
        <KunTextField v-model="lgRaw" label="Lg ≥64rem (vacío = hereda)" density="compact" inputmode="numeric" />
        <KunTextField v-model="xlRaw" label="Xl ≥80rem (vacío = hereda)" density="compact" inputmode="numeric" />

        <p class="col-span-2 text-xs text-ui-muted">
          La demo vive dentro de un KunRow de 12 columnas: la celda A es configurable y la B es fija para dar contexto.
        </p>
      </div>
    </div>
  </div>
</template>
