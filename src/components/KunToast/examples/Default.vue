<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '../src/composables/useToast.js'
import type { KunToastColor, KunToastOrientation, KunToastType } from '../src/composables/kunToastProps.js'
import type { KunToasterPosition } from '../src/composables/kunToasterProps.js'
import KunToaster from '../src/components/KunToaster.vue'
import KunBtn from '../../KunBtn/src/components/KunBtn.vue'
import KunSelect from '../../KunSelect/src/components/KunSelect.vue'
import KunSwitch from '../../KunSwitch/src/components/KunSwitch.vue'
import KunTextField from '../../KunTextField/src/components/KunTextField.vue'

const toast = useToast()

// ------------------------------------------------------------------
// Toaster (global)
// ------------------------------------------------------------------
const position = ref<KunToasterPosition>('bottom-right')
const positionOptions = ref([
  { id: 'top-left', name: 'top-left' },
  { id: 'top-center', name: 'top-center' },
  { id: 'top-right', name: 'top-right' },
  { id: 'bottom-left', name: 'bottom-left' },
  { id: 'bottom-center', name: 'bottom-center' },
  { id: 'bottom-right', name: 'bottom-right' },
])
const duration = ref<string>('5000')
const max = ref<string>('5')
const expand = ref(true)
const toasterProgress = ref(true)

// ------------------------------------------------------------------
// Toast (por-notificación)
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

const toastDuration = ref<string>('')
const progress = ref(true)
const closable = ref(true)
const avatar = ref('')
const clickable = ref(false)

function baseConfig(): Record<string, unknown> {
  return {
    color: color.value,
    orientation: orientation.value,
    type: type.value,
    progress: progress.value,
    closable: closable.value,
    avatar: avatar.value || undefined,
    duration: toastDuration.value === '' ? undefined : Number(toastDuration.value),
    onClick: clickable.value
      ? (t: { id: string | number }) => toast.add({ title: `Click en ${t.id}`, color: 'info' })
      : undefined,
  }
}

function basic(): void {
  toast.add({ title: 'Éxito', description: 'Operación completada', ...baseConfig() })
}

function withAction(): void {
  toast.add({
    title: 'Archivo eliminado',
    description: 'Puedes deshacer esta acción',
    ...baseConfig(),
    actions: [{ label: 'Deshacer', variant: 'ghost', onClick: () => toast.add({ title: 'Restaurado', color: 'info' }) }],
  })
}

function persistent(): void {
  toast.add({ title: 'Proceso en curso…', description: 'Sin auto-dismiss (duration 0)', duration: 0, ...baseConfig() })
}

async function loadingToSuccess(): Promise<void> {
  const t = toast.add({ title: 'Guardando…', duration: 0, ...baseConfig() })
  await new Promise((r) => setTimeout(r, 1500))
  toast.update(t.id, { title: 'Guardado', description: 'Cambios aplicados', color: color.value })
}

function many(): void {
  for (let i = 1; i <= 4; i++) {
    toast.add({ title: `Notificación ${i}`, description: 'Para probar el apilado / hover-expand', ...baseConfig() })
  }
}
</script>

<template>
  <div class="p-6 max-w-4xl space-y-6">
    <h1 class="text-2xl font-semibold">KunToast + useToast</h1>

    <div class="flex flex-wrap gap-2">
      <KunBtn text="Básico" @click="basic" />
      <KunBtn text="Con acción" variant="subtle" @click="withAction" />
      <KunBtn text="Loading → éxito" variant="outline" @click="loadingToSuccess" />
      <KunBtn text="Persistente" variant="soft" @click="persistent" />
      <KunBtn text="Varias (apilado)" variant="outline" @click="many" />
      <KunBtn text="Limpiar todos" variant="ghost" @click="toast.clear()" />
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <section class="space-y-3">
        <h2 class="text-sm font-semibold text-muted uppercase tracking-wide">KunToaster</h2>
        <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
          <KunSelect v-model="position" v-model:items="positionOptions" label="Position" item-value="id" item-title="name" density="compact" />
          <KunTextField v-model="duration" type="number" label="Duration (ms)" density="compact" />
          <KunTextField v-model="max" type="number" label="Max" density="compact" />
          <KunSwitch v-model="toasterProgress" label="Progress" />
          <KunSwitch v-model="expand" label="Expand" />
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-sm font-semibold text-muted uppercase tracking-wide">Toast</h2>
        <div class="grid grid-cols-2 gap-3 [&>*]:min-w-0">
          <KunSelect v-model="color" v-model:items="colorOptions" label="Color" item-value="id" item-title="name" density="compact" />
          <KunSelect v-model="orientation" v-model:items="orientationOptions" label="Orientation" item-value="id" item-title="name" density="compact" />
          <KunSelect v-model="type" v-model:items="typeOptions" label="Type" item-value="id" item-title="name" density="compact" />
          <KunTextField v-model="toastDuration" type="number" label="Duration propio (vacío = global)" density="compact" />
          <KunTextField v-model="avatar" label="Avatar (URL)" density="compact" />
          <KunSwitch v-model="progress" label="Progress" />
          <KunSwitch v-model="closable" label="Closable" />
          <KunSwitch v-model="clickable" label="onClick" />
        </div>
      </section>
    </div>

    <p class="text-sm text-muted">
      Monta <code>&lt;KunToaster&gt;</code> una sola vez. Pasa el mouse sobre un toast
      para pausar su temporizador (se reanuda al salir). Con <code>Expand</code> apagado
      solo se ve el más nuevo y se expande al hacer hover.
    </p>

    <KunToaster
      :position="position"
      :duration="Number(duration) || 5000"
      :max="Number(max) || 5"
      :expand="expand"
      :progress="toasterProgress"
    />
  </div>
</template>
