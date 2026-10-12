<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '../src/composables/useToast.js'
import type { KunToastColor, KunToastOrientation, KunToastType } from '../src/composables/kunToastProps.js'
import KunToaster from '../src/components/KunToaster.vue'
import KunBtn from '../../KunBtn/src/components/KunBtn.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'

const toast = useToast()

// ------------------------------------------------------------------
// Controles del playground: uniones tipadas
// ------------------------------------------------------------------
const color = ref<KunToastColor>('success')
const colorOptions = ref([
  { id: 'primary', name: 'primary' },
  { id: 'success', name: 'success' },
  { id: 'error', name: 'error' },
  { id: 'warning', name: 'warning' },
  { id: 'info', name: 'info' },
  { id: 'neutral', name: 'neutral' },
])

const orientation = ref<KunToastOrientation>('vertical')
const orientationOptions = ref([
  { id: 'vertical', name: 'vertical' },
  { id: 'horizontal', name: 'horizontal' },
])

const type = ref<KunToastType>('foreground')
const typeOptions = ref([
  { id: 'foreground', name: 'foreground' },
  { id: 'background', name: 'background' },
])

function basic(): void {
  toast.add({ title: 'Éxito', description: 'Operación completada', color: color.value, orientation: orientation.value, type: type.value })
}

function withAction(): void {
  toast.add({
    title: 'Archivo eliminado',
    description: 'Puedes deshacer esta acción',
    color: color.value,
    orientation: orientation.value,
    type: type.value,
    actions: [{ label: 'Deshacer', variant: 'text', onClick: () => toast.add({ title: 'Restaurado', color: 'info' }) }],
  })
}

async function loadingToSuccess(): Promise<void> {
  const t = toast.add({ title: 'Guardando…', duration: 0, orientation: orientation.value, type: type.value })
  await new Promise((r) => setTimeout(r, 1500))
  toast.update(t.id, { title: 'Guardado', description: 'Cambios aplicados', color: color.value })
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

    <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
      <KunSelect
        v-model="color"
        v-model:items="colorOptions"
        label="Color"
        item-value="id"
        item-title="name"
        density="compact"
      />
      <KunSelect
        v-model="orientation"
        v-model:items="orientationOptions"
        label="Orientation"
        item-value="id"
        item-title="name"
        density="compact"
      />
      <KunSelect
        v-model="type"
        v-model:items="typeOptions"
        label="Type"
        item-value="id"
        item-title="name"
        density="compact"
      />
    </div>

    <p class="text-sm text-ui-muted">
      Monta <code>&lt;KunToaster&gt;</code> una sola vez (aquí abajo con posición
      bottom-right y máximo 5 visibles).
    </p>

    <KunToaster position="bottom-right" :duration="5000" :max="5" />
  </div>
</template>
