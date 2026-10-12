<script setup lang="ts">
import { ref } from 'vue'
import KunContainer from '../src/components/KunContainer.vue'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

const fluid = ref(false)
const klass = ref('')
</script>

<template>
  <div class="p-4 grid gap-6 lg:grid-cols-2 lg:items-start">
    <!-- Vista previa (fija: siempre visible al scrollear opciones) -->
    <div class="space-y-3 min-w-0 lg:sticky lg:top-4">
      <h2 class="text-lg font-semibold">KunContainer</h2>

      <div class="rounded-xl border border-ui p-3">
        <KunContainer :fluid="fluid" :class="klass || undefined">
          <div class="rounded border border-primary bg-primary/20 p-4 text-center text-sm">
            {{ fluid ? 'Fluid: ocupa todo el ancho disponible' : 'Contenido: max-width responsivo centrado' }}
          </div>
        </KunContainer>
      </div>

      <p class="font-mono text-xs text-ui-muted">
        fluid={{ fluid }}{{ klass ? ` class="${klass}"` : '' }}
      </p>
    </div>

    <!-- Panel de configuración (scroll propio) -->
    <div class="space-y-4 rounded-xl border border-ui p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-ui-muted">Configuración</h3>

      <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
        <KunSwitch v-model="fluid" label="Fluid (sin max-width)" />
        <KunTextField v-model="klass" label="Class extra (vacío = ninguna)" density="compact" />

        <p class="col-span-2 text-xs text-ui-muted">
          Sin fluid el contenedor se centra con max-width por breakpoint; con fluid ocupa todo el ancho.
        </p>
      </div>
    </div>
  </div>
</template>
