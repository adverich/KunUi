<script setup lang="ts">
import { useToast } from '../src/composables/useToast.js'
import KunToaster from '../src/components/KunToaster.vue'
import KunBtn from '../../KunBtn/src/components/KunBtn.vue'

const toast = useToast()

function basic(): void {
  toast.add({ title: 'Éxito', description: 'Operación completada', color: 'success' })
}

function withAction(): void {
  toast.add({
    title: 'Archivo eliminado',
    description: 'Puedes deshacer esta acción',
    color: 'warning',
    actions: [{ label: 'Deshacer', variant: 'text', onClick: () => toast.add({ title: 'Restaurado', color: 'info' }) }],
  })
}

async function loadingToSuccess(): Promise<void> {
  const t = toast.add({ title: 'Guardando…', duration: 0 })
  await new Promise((r) => setTimeout(r, 1500))
  toast.update(t.id, { title: 'Guardado', description: 'Cambios aplicados', color: 'success' })
}
</script>

<template>
  <div class="p-6 max-w-2xl space-y-6">
    <h1 class="text-2xl font-semibold">KunToast + useToast</h1>

    <div class="flex flex-wrap gap-2">
      <KunBtn text="Básico" @click="basic" />
      <KunBtn text="Con acción" variant="tonal" @click="withAction" />
      <KunBtn text="Loading → éxito" variant="outlined" @click="loadingToSuccess" />
      <KunBtn text="Limpiar todos" variant="text" @click="toast.clear()" />
    </div>

    <p class="text-sm text-ui-muted">
      Monta <code>&lt;KunToaster&gt;</code> una sola vez (aquí abajo con posición
      bottom-right y máximo 5 visibles).
    </p>

    <KunToaster position="bottom-right" :duration="5000" :max="5" />
  </div>
</template>
